import torch
import torch.nn as nn
import torch.nn.functional as F

class EnsembleOptimizerAgent(nn.Module):
    """
    Ensemble Optimizer RL Agent for DFA.
    Dynamically reweights sub-models based on frame context and biophysical consistency:
    - Vision Transformer (ViT-Huge) [Baseline default ~45%]
    - Xception-TimeSformer [Baseline default ~32%]
    - NeuralHash & PRNU Camera Sensor Analyzer [Baseline default ~23%]
    """
    def __init__(self, in_features=512):
        super(EnsembleOptimizerAgent, self).__init__()
        
        self.context_encoder = nn.Sequential(
            nn.Linear(in_features, 128),
            nn.ReLU(),
            nn.Linear(128, 3)
        )
        
        # Default baseline bias prior [45%, 32%, 23%]
        self.register_buffer("base_weights", torch.tensor([0.45, 0.32, 0.23]))

    def forward(self, context_latent):
        """
        context_latent: Latent vector representing current frame (B, 512)
        Returns:
            ensemble_weights: Dynamic weights for [ViT, Xception-TimeSformer, PRNU-Hash] (B, 3)
        """
        raw_adjustments = self.context_encoder(context_latent)
        # Add baseline prior and apply softmax
        logits = torch.log(self.base_weights.unsqueeze(0) + 1e-6) + raw_adjustments
        ensemble_weights = F.softmax(logits, dim=-1)
        return ensemble_weights

    def combine_predictions(self, vit_pred, xception_pred, prnu_pred, ensemble_weights):
        """
        Weighted combination of sub-model predictions.
        """
        preds = torch.stack([vit_pred, xception_pred, prnu_pred], dim=-1)  # (B, 3)
        fused_pred = (preds * ensemble_weights).sum(dim=-1)
        return fused_pred
