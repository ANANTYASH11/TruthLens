import torch
import torch.nn as nn
import torch.nn.functional as F

class MicroTextureAnalyzer(nn.Module):
    """
    Micro-Texture Analyzer Module for DFA.
    Inspects 5µm-resolution high-frequency CNN patches to detect GAN and Diffusion fingerprints.
    """
    def __init__(self, out_dim=256):
        super(MicroTextureAnalyzer, self).__init__()
        
        # Micro-patch feature extractor
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1)
        self.gn1 = nn.GroupNorm(8, 32)
        
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=2, padding=1)
        self.gn2 = nn.GroupNorm(8, 64)
        
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1)
        self.gn3 = nn.GroupNorm(8, 128)
        
        # High-frequency residual extractor
        self.micro_pool = nn.AdaptiveAvgPool2d((8, 8))
        self.fc = nn.Sequential(
            nn.Linear(128 * 8 * 8, 512),
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(512, out_dim)
        )
        
    def extract_patch_residual(self, x):
        """Extract localized micro-texture variance across patches."""
        # Unfold into 16x16 non-overlapping patches
        patches = x.unfold(2, 16, 16).unfold(3, 16, 16)
        patch_std = patches.std(dim=(-2, -1))
        return patch_std

    def forward(self, x):
        h = F.gelu(self.gn1(self.conv1(x)))
        h = F.gelu(self.gn2(self.conv2(h)))
        h = F.gelu(self.gn3(self.conv3(h)))
        
        pooled = self.micro_pool(h).flatten(1)
        texture_feat = self.fc(pooled)
        patch_variance = self.extract_patch_residual(x)
        
        return texture_feat, patch_variance
