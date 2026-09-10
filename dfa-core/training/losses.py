import torch
import torch.nn as nn
import torch.nn.functional as F

class DFALoss(nn.Module):
    """
    Multi-objective Loss Function for DeepFake Forensic Analyzer.
    L_total = 0.5 * L_Focal + 0.3 * L_RL + 0.2 * L_rPPG
    """
    def __init__(self, alpha=0.25, gamma=2.0, w_focal=0.5, w_rl=0.3, w_rppg=0.2):
        super(DFALoss, self).__init__()
        self.alpha = alpha
        self.gamma = gamma
        self.w_focal = w_focal
        self.w_rl = w_rl
        self.w_rppg = w_rppg

    def focal_loss(self, logits, targets):
        """
        Binary Focal Loss to handle dataset class imbalance and hard samples.
        """
        bce_loss = F.binary_cross_entropy_with_logits(logits[:, 1] - logits[:, 0], targets.float(), reduction='none')
        pt = torch.exp(-bce_loss)
        focal = self.alpha * (1 - pt) ** self.gamma * bce_loss
        return focal.mean()

    def forward(self, logits, targets, rl_reward=None, rppg_consistency=None):
        # 1. Focal Loss
        l_focal = self.focal_loss(logits, targets)
        
        # 2. RL Loss (Policy Gradient negative expected reward)
        if rl_reward is not None:
            l_rl = -torch.mean(rl_reward)
        else:
            l_rl = torch.tensor(0.0, device=logits.device)
            
        # 3. rPPG Biophysical Loss (1.0 - consistency for real, consistency for fake)
        if rppg_consistency is not None:
            rppg_target = (targets == 0).float().unsqueeze(-1)  # Real samples should have high consistency
            l_rppg = F.mse_loss(rppg_consistency, rppg_target)
        else:
            l_rppg = torch.tensor(0.0, device=logits.device)
            
        # Total Weighted Loss
        l_total = self.w_focal * l_focal + self.w_rl * l_rl + self.w_rppg * l_rppg
        
        return {
            "total_loss": l_total,
            "focal_loss": l_focal,
            "rl_loss": l_rl,
            "rppg_loss": l_rppg
        }
