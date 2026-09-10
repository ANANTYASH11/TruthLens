import os
import sys
import argparse
import numpy as np

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from data.adversarial_gym.generator_env import AdversarialGymEnv

def run_adversarial_gym(generator="stylegan3", detector="dfa", epochs=10):
    print(f"[DFA Adversarial Gym] Generator: {generator} vs Detector: {detector} ({epochs} battles)")
    env = AdversarialGymEnv()
    
    state = env.reset()
    total_rewards = 0.0
    for battle in range(epochs):
        action = np.random.uniform(0.5, 0.95)  # Simulated threshold action
        next_state, reward, done, info = env.step(action)
        total_rewards += reward
        print(f"Battle [{battle+1}/{epochs}] | Attack Intensity: {info['attack_intensity']:.3f} | Detector Confidence: {info['detector_confidence']:.3f} | Reward: {reward}")
        if done:
            break
            
    print(f"[DFA Adversarial Gym] Battle complete. Total Cumulative Reward: {total_rewards:.2f}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--generator", type=str, default="stylegan3")
    parser.add_argument("--detector", type=str, default="dfa")
    parser.add_argument("--epochs", type=int, default=10)
    args = parser.parse_args()
    
    run_adversarial_gym(generator=args.generator, detector=args.detector, epochs=args.epochs)
