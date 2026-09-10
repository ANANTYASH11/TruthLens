import torch
import torch.nn as nn
import torch.nn.functional as F
from .spectral_attention import MultiSpectralAttention
from .micro_texture import MicroTextureAnalyzer

class ViTHugeBackbone(nn.Module):
    """
    Vision Transformer (ViT-Huge) Hybrid Backbone for DeepFake Forensic Analyzer.
    Pretrained-ready architecture with multi-spectral attention and micro-texture integration.
    """
    def __init__(self, num_classes=2, embed_dim=1280):
        super(ViTHugeBackbone, self).__init__()
        self.embed_dim = embed_dim
        
        # Patch embedding layer
        self.patch_embed = nn.Conv2d(3, 256, kernel_size=14, stride=14)
        self.cls_token = nn.Parameter(torch.zeros(1, 1, 256))
        
        # Multi-Spectral Attention
        self.spectral_attn = MultiSpectralAttention(embed_dim=embed_dim)
        
        # Micro-Texture Patch Analyzer
        self.texture_analyzer = MicroTextureAnalyzer(out_dim=256)
        
        # Combined Feature Fusion Head
        self.fusion = nn.Sequential(
            nn.Linear(embed_dim + 256 + 256, 512),
            nn.LayerNorm(512),
            nn.GELU(),
            nn.Dropout(0.3)
        )
        
        # Classifier (0: Real, 1: Fake)
        self.classifier = nn.Linear(512, num_classes)
        
    def forward(self, x):
        B = x.shape[0]
        
        # 1. Patch Embedding
        patches = self.patch_embed(x).flatten(2).transpose(1, 2)  # (B, N, 256)
        cls_tokens = self.cls_token.expand(B, -1, -1)
        patches_with_cls = torch.cat((cls_tokens, patches), dim=1)
        patch_feat = patches_with_cls.mean(dim=1)  # (B, 256)
        
        # 2. Multi-Spectral Attention Features
        spectral_feat, modality_weights, fft_map, dct_map = self.spectral_attn(x)  # (B, embed_dim), (B, 3)
        
        # 3. Micro-Texture Analysis Features
        texture_feat, patch_variance = self.texture_analyzer(x)  # (B, 256)
        
        # 4. Fuse Features
        fused = torch.cat([spectral_feat, texture_feat, patch_feat], dim=-1)  # (B, embed_dim + 256 + 256)
        latent = self.fusion(fused)
        logits = self.classifier(latent)
        probs = F.softmax(logits, dim=-1)
        
        return {
            "logits": logits,
            "probs": probs,
            "fake_score": probs[:, 1],
            "latent": latent,
            "modality_weights": modality_weights,
            "fft_map": fft_map,
            "dct_map": dct_map,
            "patch_variance": patch_variance
        }
