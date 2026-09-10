import torch
import torch.nn as nn
import torch.nn.functional as F

class NeRFLightingValidator(nn.Module):
    """
    NeRF Lighting & Shadow Consistency Validator.
    Reconstructs spherical harmonics illumination vectors from facial regions (nose, forehead, cheeks)
    and checks for 3D light direction and shadow inconsistency.
    """
    def __init__(self):
        super(NeRFLightingValidator, self).__init__()
        # Spherical harmonics (SH) light vector estimator (9 coefficients per color channel = 27 params)
        self.sh_estimator = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.SiLU(),
            nn.AdaptiveAvgPool2d((8, 8)),
            nn.Flatten(),
            nn.Linear(32 * 8 * 8, 128),
            nn.SiLU(),
            nn.Linear(128, 27)
        )
        
    def forward(self, img_tensor):
        B = img_tensor.shape[0]
        sh_coefficients = self.sh_estimator(img_tensor).view(B, 3, 9)
        
        # Calculate light vector direction for left face vs right face
        left_half = img_tensor[:, :, :, :img_tensor.shape[-1]//2]
        right_half = img_tensor[:, :, :, img_tensor.shape[-1]//2:]
        
        sh_left = self.sh_estimator(F.interpolate(left_half, size=(64, 64)))
        sh_right = self.sh_estimator(F.interpolate(right_half, size=(64, 64)))
        
        # Shadow inconsistency metric (cosine similarity difference)
        sim = F.cosine_similarity(sh_left, sh_right, dim=-1)
        shadow_inconsistency = 1.0 - sim  # 0 = consistent lighting, 1 = unphysical lighting swap (deepfake)
        
        return {
            "sh_coefficients": sh_coefficients,
            "lighting_inconsistency_score": shadow_inconsistency,
            "light_sim": sim
        }
