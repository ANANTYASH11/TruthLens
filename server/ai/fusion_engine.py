"""
TruthLens Multimodal Fusion Engine
Merges PyTorch Grad-CAM visual forensics, 2D FFT spectral harmonics,
and regional language claim analysis into a unified Trust Score (0-100%).
"""

import numpy as np
from typing import Dict, Any

class FusionEngine:
    def __init__(self):
        self.weights = {
            "media_forensics": 0.45,
            "text_linguistics": 0.35,
            "fact_check_alignment": 0.20
        }

    def fuse(self, media_result: Dict[str, Any], text_result: Dict[str, Any]) -> Dict[str, Any]:
        media_trust = media_result.get("media_trust_score", 50.0)
        text_trust = text_result.get("text_trust_score", 50.0)

        # Fact check influence
        matched_fcs = text_result.get("matched_fact_checks", [])
        top_fc = matched_fcs[0] if matched_fcs else None

        if top_fc and top_fc.get("similarity_score", 0.0) > 0.45:
            fc_trust = 15.0
            fc_status = f"Known debunk match: '{top_fc.get('title')}' by {top_fc.get('source')}"
        elif top_fc and top_fc.get("similarity_score", 0.0) > 0.25:
            fc_trust = 42.0
            fc_status = f"Partial match with claim debunked by {top_fc.get('source')}"
        else:
            fc_trust = 78.0
            fc_status = "No direct debunk matches found in current fact-checked database"

        discrepancy = abs(media_trust - text_trust)

        # Mathematical convex combination
        fused = (
            (media_trust * self.weights["media_forensics"]) +
            (text_trust * self.weights["text_linguistics"]) +
            (fc_trust * self.weights["fact_check_alignment"])
        )

        # Context recycling penalty
        context_recycling = False
        if discrepancy > 40.0:
            fused = max(5.0, fused - 10.0)
            context_recycling = True

        trust_score = round(float(np.clip(fused, 3.0, 97.0)), 1)
        confidence_margin = round(3.2 + (discrepancy / 100.0) * 2.5, 1)

        if trust_score >= 70.0:
            verdict = "VERIFIED AUTHENTIC CONTENT"
            risk_level = "LOW RISK"
            narrative = "Visual forensics and text claims display consistent, authentic biophysical signatures."
        elif trust_score >= 40.0:
            verdict = "QUESTIONABLE / CONTEXT MISMATCH"
            risk_level = "MODERATE RISK"
            narrative = (
                "Discrepancy detected between media biophysics and text claim (context recycling suspected)."
                if context_recycling else
                "Content exhibits borderline manipulation markers requiring human editorial review."
            )
        else:
            verdict = "FABRICATED MANIPULATION DETECTED"
            risk_level = "CRITICAL RISK"
            narrative = (
                "High-confidence forensic anomaly detection. Visual analysis reveals generative boundary artifacts, "
                "corroborated by sensational regional language manipulation cues."
            )

        return {
            "unified_trust_score": trust_score,
            "confidence_margin": confidence_margin,
            "verdict": verdict,
            "risk_level": risk_level,
            "summary_narrative": narrative,
            "context_recycling_detected": context_recycling,
            "cross_modal_discrepancy": round(discrepancy, 1),
            "breakdown": {
                "media_forensics": {
                    "trust_score": media_trust,
                    "weight_pct": 45,
                    "weighted_contribution": round(media_trust * 0.45, 1)
                },
                "text_linguistics": {
                    "trust_score": text_trust,
                    "weight_pct": 35,
                    "weighted_contribution": round(text_trust * 0.35, 1),
                    "language": text_result.get("language_name", "Regional")
                },
                "fact_check_alignment": {
                    "trust_score": fc_trust,
                    "weight_pct": 20,
                    "weighted_contribution": round(fc_trust * 0.20, 1),
                    "status": fc_status
                }
            },
            "evidence_trail": [
                f"Visual Forensics: {media_trust}% authentic score based on Grad-CAM spatial boundaries & 2D FFT harmonics.",
                f"Linguistic Analysis: {text_trust}% credibility index in {text_result.get('language_name', 'Regional')}.",
                f"Fact-Check Alignment: {fc_status}."
            ]
        }

# Singleton instance
_fusion_instance = None

def get_fusion_engine() -> FusionEngine:
    global _fusion_instance
    if _fusion_instance is None:
        _fusion_instance = FusionEngine()
    return _fusion_instance
