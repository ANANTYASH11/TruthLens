import os
import sys
import argparse
import yaml
import torch
import torch.nn as nn
from torch.utils.data import DataLoader

# Add root directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.vit_huge.vit_backbone import ViTHugeBackbone
from models.rl_agents.dynamic_attention import DynamicAttentionAgent
from models.rl_agents.ensemble_optimizer import EnsembleOptimizerAgent
from models.physics.rppg_validator import RPPGValidator
from models.physics.prnu_analyzer import PRNUAnalyzer
from models.physics.nerf_lighting import NeRFLightingValidator
from data.loaders.dataset import DeepFakeDataset
from training.losses import DFALoss

def train_pipeline(phase="pretrain", config_path="configs/train.yaml", epochs=1):
    print(f"[DFA Training] Starting phase: {phase} | Config: {config_path}")
    
    # Auto-detect device (CUDA, MPS, or CPU)
    if torch.cuda.is_available():
        device = torch.device("cuda")
    elif torch.backends.mps.is_available():
        device = torch.device("mps")
    else:
        device = torch.device("cpu")
    print(f"[DFA Hardware] Active device: {device}")
    
    # Initialize models
    vit_model = ViTHugeBackbone().to(device)
    rl_agent = DynamicAttentionAgent().to(device)
    ensemble_agent = EnsembleOptimizerAgent().to(device)
    rppg_val = RPPGValidator().to(device)
    prnu_val = PRNUAnalyzer().to(device)
    nerf_val = NeRFLightingValidator().to(device)
    
    criterion = DFALoss().to(device)
    optimizer = torch.optim.AdamW(vit_model.parameters(), lr=5e-6)
    
    # Dataloader
    dataset = DeepFakeDataset(num_samples=20)
    dataloader = DataLoader(dataset, batch_size=4, shuffle=True)
    
    vit_model.train()
    for epoch in range(epochs):
        total_epoch_loss = 0.0
        for batch_idx, batch in enumerate(dataloader):
            imgs = batch["image"].to(device)
            labels = batch["label"].to(device)
            
            optimizer.zero_grad()
            
            # Forward pass through ViT Backbone
            vit_out = vit_model(imgs)
            logits = vit_out["logits"]
            probs = vit_out["probs"]
            latent = vit_out["latent"]
            
            # Biophysical validation
            rppg_res = rppg_val(imgs)
            prnu_res = prnu_val(imgs)
            nerf_res = nerf_val(imgs)
            
            # RL Attention agent observation state
            state = torch.cat([latent, vit_out["modality_weights"], rppg_res["rppg_consistency"].unsqueeze(1), prnu_res["prnu_anomaly_score"].unsqueeze(1), nerf_res["lighting_inconsistency_score"].unsqueeze(1)], dim=-1)
            action_probs, state_value = rl_agent(state)
            rl_reward = rl_agent.compute_reward(probs[:, 1], labels.float())
            
            # Loss calculation
            loss_dict = criterion(logits, labels, rl_reward=rl_reward, rppg_consistency=rppg_res["rppg_consistency"])
            loss = loss_dict["total_loss"]
            
            loss.backward()
            optimizer.step()
            
            total_epoch_loss += loss.item()
            if batch_idx % 2 == 0:
                print(f"Epoch [{epoch+1}/{epochs}] Step [{batch_idx+1}/{len(dataloader)}] Loss: {loss.item():.4f} (Focal: {loss_dict['focal_loss'].item():.4f}, RL: {loss_dict['rl_loss'].item():.4f}, rPPG: {loss_dict['rppg_loss'].item():.4f})")
                
    print(f"[DFA Training] Completed {phase} phase successfully.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DFA Training Protocol")
    parser.add_argument("--phase", type=str, default="pretrain", choices=["pretrain", "rl", "adversarial"], help="Training phase")
    parser.add_argument("--config", type=str, default="configs/train.yaml", help="Path to config file")
    parser.add_argument("--epochs", type=int, default=1, help="Number of epochs")
    args = parser.parse_args()
    
    train_pipeline(phase=args.phase, config_path=args.config, epochs=args.epochs)
