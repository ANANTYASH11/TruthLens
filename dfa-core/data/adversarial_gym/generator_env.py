import torch
import numpy as np

class AdversarialGymEnv:
    """
    Generator-Detector Gym Environment for DFA.
    Simulates adversarial deepfake attacks from StyleGAN3 and Stable Diffusion 3
    to continuously challenge the DFA detector.
    """
    def __init__(self, config=None):
        self.config = config or {}
        self.episode_step = 0
        self.max_steps = 100

    def step(self, detector_action):
        """
        Step adversarial simulation.
        detector_action: Array or float representing detector sensitivity / confidence threshold.
        """
        self.episode_step += 1
        
        # Simulate generator evolving attack strength (perturbation magnitude)
        attack_intensity = np.clip(0.2 + 0.005 * self.episode_step + np.random.normal(0, 0.05), 0.1, 0.9)
        
        # Detector success probability based on action and attack intensity
        detector_confidence = np.clip(1.0 - (attack_intensity * 0.4) + np.random.normal(0, 0.03), 0.5, 0.99)
        reward = 1.0 if detector_confidence > 0.85 else -1.0
        
        done = self.episode_step >= self.max_steps
        info = {
            "attack_type": "StyleGAN3_SD3_Hybrid",
            "attack_intensity": attack_intensity,
            "detector_confidence": detector_confidence,
            "step": self.episode_step
        }
        
        return np.random.randn(512), reward, done, info

    def reset(self):
        self.episode_step = 0
        return np.random.randn(512)
