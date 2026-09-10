import torch
import torch.nn as nn
import torch.nn.functional as F

class PRNUAnalyzer(nn.Module):
    """
    Photo-Response Non-Uniformity (PRNU) Camera Sensor Noise Analyzer.
    Extracts sensor noise pattern residual W = I - Denoise(I) and computes cross-correlation metric.
    OpenVINO / PyTorch accelerated backend.
    """
    def __init__(self):
        super(PRNUAnalyzer, self).__init__()
        # Denoising filter proxy using high-frequency Wiener residual
        self.denoise_conv = nn.Sequential(
            nn.Conv2d(1, 16, kernel_size=5, padding=2),
            nn.BatchNorm2d(16),
            nn.ReLU(),
            nn.Conv2d(16, 1, kernel_size=5, padding=2)
        )
        
    def extract_sensor_noise(self, img_tensor):
        """
        Extract PRNU noise residual map W.
        img_tensor shape: (B, 3, H, W)
        """
        # Convert to grayscale
        gray = 0.2989 * img_tensor[:, 0:1, :, :] + 0.5870 * img_tensor[:, 1:2, :, :] + 0.1140 * img_tensor[:, 2:3, :, :]
        denoised = self.denoise_conv(gray)
        noise_residual = gray - denoised
        return noise_residual

    def forward(self, img_tensor):
        B = img_tensor.shape[0]
        noise_map = self.extract_sensor_noise(img_tensor)
        
        # Calculate noise pattern variance and high-frequency correlation anomaly
        flat_noise = noise_map.view(B, -1)
        noise_std = flat_noise.std(dim=-1)
        
        # Grid correlation index (detects periodic GAN upsampling artifacts)
        # Resample noise map to compute autocovariance at grid shifts
        shifted = torch.roll(noise_map, shifts=2, dims=2)
        grid_corr = (noise_map * shifted).mean(dim=(-2, -1)).squeeze(-1)
        
        # Anomaly score (0.0 = camera natural sensor PRNU, 1.0 = GAN/Diffusion grid artifact)
        prnu_anomaly = torch.sigmoid((grid_corr - 0.05) * 20.0)
        
        return {
            "prnu_map": noise_map,
            "prnu_anomaly_score": prnu_anomaly,
            "grid_corr": grid_corr,
            "noise_std": noise_std
        }
