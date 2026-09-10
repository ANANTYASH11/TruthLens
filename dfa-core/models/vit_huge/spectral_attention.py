import torch
import torch.nn as nn
import torch.nn.functional as F

class MultiSpectralAttention(nn.Module):
    """
    Multi-Spectral Attention Module for DFA.
    Processes RGB frames, 2D FFT frequency maps, and DCT-compressed residual features simultaneously.
    """
    def __init__(self, embed_dim=1280, num_heads=8):
        super(MultiSpectralAttention, self).__init__()
        self.embed_dim = embed_dim
        self.num_heads = num_heads
        
        # Projection layers for 3 modalities: RGB, FFT, DCT
        self.rgb_proj = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=3, padding=1),
            nn.SiLU(),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.AdaptiveAvgPool2d((16, 16))
        )
        
        self.fft_proj = nn.Sequential(
            nn.Conv2d(1, 64, kernel_size=3, padding=1),
            nn.SiLU(),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.AdaptiveAvgPool2d((16, 16))
        )
        
        self.dct_proj = nn.Sequential(
            nn.Conv2d(1, 64, kernel_size=3, padding=1),
            nn.SiLU(),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.AdaptiveAvgPool2d((16, 16))
        )
        
        self.attn = nn.MultiheadAttention(embed_dim=384, num_heads=num_heads, batch_first=True)
        self.out_proj = nn.Linear(384, embed_dim)
        self.spectral_gate = nn.Sequential(
            nn.Linear(384, 3),
            nn.Softmax(dim=-1)
        )

    def extract_fft(self, x):
        """Compute 2D FFT log-magnitude map per frame."""
        # Convert x (B, C, H, W) to grayscale for FFT
        gray = 0.2989 * x[:, 0:1, :, :] + 0.5870 * x[:, 1:2, :, :] + 0.1140 * x[:, 2:3, :, :]
        fft = torch.fft.fft2(gray)
        fft_shift = torch.fft.fftshift(fft)
        magnitude = torch.abs(fft_shift)
        log_mag = torch.log(magnitude + 1e-8)
        # Normalize to [0, 1]
        b, c, h, w = log_mag.shape
        log_mag_flat = log_mag.view(b, -1)
        min_v = log_mag_flat.min(dim=1, keepdim=True)[0].view(b, 1, 1, 1)
        max_v = log_mag_flat.max(dim=1, keepdim=True)[0].view(b, 1, 1, 1)
        norm_mag = (log_mag - min_v) / (max_v - min_v + 1e-8)
        return norm_mag

    def extract_dct_residual(self, x):
        """Extract high-frequency DCT-compressed residual proxy features."""
        gray = 0.2989 * x[:, 0:1, :, :] + 0.5870 * x[:, 1:2, :, :] + 0.1140 * x[:, 2:3, :, :]
        # High pass Laplacian filter as DCT frequency anomaly proxy
        kernel = torch.tensor([[-1., -1., -1.], [-1., 8., -1.], [-1., -1., -1.]], device=x.device).unsqueeze(0).unsqueeze(0)
        dct_residual = F.conv2d(gray, kernel, padding=1)
        return torch.abs(dct_residual)

    def forward(self, x):
        B = x.shape[0]
        
        # 1. Extract frequency representations
        fft_map = self.extract_fft(x)
        dct_map = self.extract_dct_residual(x)
        
        # 2. Project modalities
        f_rgb = self.rgb_proj(x).flatten(2).transpose(1, 2)  # (B, 256, 128)
        f_fft = self.fft_proj(fft_map).flatten(2).transpose(1, 2)  # (B, 256, 128)
        f_dct = self.dct_proj(dct_map).flatten(2).transpose(1, 2)  # (B, 256, 128)
        
        # Concatenate 3 modalities into multi-spectral sequence
        f_combined = torch.cat([f_rgb, f_fft, f_dct], dim=-1)  # (B, 256, 384)
        
        # 3. Multi-head cross-attention
        attn_out, _ = self.attn(f_combined, f_combined, f_combined)
        
        # 4. Gated Modality Weighting
        pooled = attn_out.mean(dim=1)  # (B, 384)
        modality_weights = self.spectral_gate(pooled)  # (B, 3) -> [RGB_weight, FFT_weight, DCT_weight]
        
        # 5. Output projection to ViT embedding dimension
        out = self.out_proj(pooled)  # (B, embed_dim)
        
        return out, modality_weights, fft_map, dct_map
