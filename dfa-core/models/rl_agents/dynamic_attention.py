import torch
import torch.nn as nn
import torch.nn.functional as F

class DynamicAttentionAgent(nn.Module):
    """
    PPO-based Dynamic Attention RL Agent.
    Observation Space: ViT embeddings (512-dim), rPPG pulse signals, frequency anomaly scores.
    Action Space: Weight adjustments for facial regions [eyes, mouth, skin].
    Reward: +1 for correct high-confidence detection, -2 for false negatives.
    """
    def __init__(self, state_dim=512 + 3 + 3, action_dim=3):
        super(DynamicAttentionAgent, self).__init__()
        
        # Policy Network (Actor)
        self.actor = nn.Sequential(
            nn.Linear(state_dim, 256),
            nn.Tanh(),
            nn.Linear(256, 128),
            nn.Tanh(),
            nn.Linear(128, action_dim),
            nn.Softmax(dim=-1)
        )
        
        # Value Network (Critic)
        self.critic = nn.Sequential(
            nn.Linear(state_dim, 256),
            nn.Tanh(),
            nn.Linear(256, 128),
            nn.Tanh(),
            nn.Linear(128, 1)
        )

    def forward(self, state):
        """
        state: Tensor of shape (B, state_dim) containing ViT latent + physics indicators
        Returns:
            action_probs: Region attention weights (B, 3) [eyes, mouth, skin]
            value: Estimated state value (B, 1)
        """
        action_probs = self.actor(state)
        value = self.critic(state)
        return action_probs, value

    def compute_reward(self, pred_prob, true_label, confidence_threshold=0.85):
        """
        Compute RL reward:
        +1 for correct high-confidence detection, -2 for false negatives.
        """
        pred_label = (pred_prob >= 0.5).float()
        is_correct = (pred_label == true_label).float()
        
        # Reward design
        rewards = torch.zeros_like(pred_prob)
        # Correct high-confidence detection
        high_conf_correct = is_correct * (torch.abs(pred_prob - 0.5) * 2 >= confidence_threshold).float()
        rewards += high_conf_correct * 1.0
        
        # False negative penalty (-2)
        false_negative = (true_label == 1.0) * (pred_label == 0.0)
        rewards -= false_negative.float() * 2.0
        
        # Moderate reward for remaining correct predictions
        standard_correct = is_correct * (1.0 - high_conf_correct)
        rewards += standard_correct * 0.5
        
        return rewards
