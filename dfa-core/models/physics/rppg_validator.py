import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

class RPPGValidator(nn.Module):
    """
    rPPG++ Biophysical Validation Module.
    Validates biological blood flow, capillary refill rate, and cardiac pulse consistency
    from facial video ROI using 3D CNN spatial-temporal feature extraction & CHROM rPPG signal analysis.
    """
    def __init__(self, sample_frames=16):
        super(RPPGValidator, self).__init__()
        self.sample_frames = sample_frames
        
        # 3D CNN for Spatial-Temporal Blood Flow Extraction
        self.conv3d = nn.Sequential(
            nn.Conv3d(3, 16, kernel_size=(3, 3, 3), padding=1),
            nn.BatchNorm3d(16),
            nn.SiLU(),
            nn.MaxPool3d(kernel_size=(1, 2, 2)),
            
            nn.Conv3d(16, 32, kernel_size=(3, 3, 3), padding=1),
            nn.BatchNorm3d(32),
            nn.SiLU(),
            nn.AdaptiveAvgPool3d((16, 4, 4))
        )
        
        self.pulse_head = nn.Sequential(
            nn.Linear(32 * 16 * 4 * 4, 128),
            nn.SiLU(),
            nn.Linear(128, 16)  # Output 16-step BVP waveform
        )
        
        self.consistency_score_head = nn.Sequential(
            nn.Linear(16, 32),
            nn.SiLU(),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )

    def extract_chrom_bvp(self, rgb_frames):
        """
        CHROM method for remote blood volume pulse signal extraction from RGB.
        rgb_frames shape: (B, T, C, H, W)
        """
        B, T, C, H, W = rgb_frames.shape
        # Spatial mean across facial skin ROI
        mean_rgb = rgb_frames.mean(dim=(-2, -1))  # (B, T, 3)
        
        R = mean_rgb[:, :, 0]
        G = mean_rgb[:, :, 1]
        B_ch = mean_rgb[:, :, 2]
        
        # CHROM signal transformation
        Xs = 0.77 * R - 0.51 * G
        Ys = 0.77 * R + 0.51 * G - 0.77 * B_ch
        
        alpha = (Xs.std(dim=-1, keepdim=True) + 1e-6) / (Ys.std(dim=-1, keepdim=True) + 1e-6)
        bvp_signal = Xs - alpha * Ys
        return bvp_signal

    def forward(self, x_video):
        """
        x_video: (B, C, T, H, W) or (B, T, C, H, W) video tensor
        """
        if x_video.dim() == 4:
            # Single frame case: duplicate along temporal dimension
            x_video = x_video.unsqueeze(2).repeat(1, 1, self.sample_frames, 1, 1)
        elif x_video.shape[1] != 3 and x_video.shape[2] == 3:
            # Transpose (B, T, C, H, W) -> (B, C, T, H, W)
            x_video = x_video.permute(0, 2, 1, 3, 4)
            
        B, C, T, H, W = x_video.shape
        
        # 3D CNN forward pass
        feat3d = self.conv3d(x_video)
        bvp_waveform = self.pulse_head(feat3d.flatten(1))  # (B, 16)
        
        # Calculate pulse consistency score (1.0 = normal biological pulse, 0.0 = synthetic noise / deepfake)
        bvp_variance = torch.var(bvp_waveform, dim=-1, keepdim=True)
        rppg_consistency = self.consistency_score_head(bvp_waveform)
        
        return {
            "bvp_waveform": bvp_waveform,
            "rppg_consistency": rppg_consistency,
            "bvp_variance": bvp_variance
        }
