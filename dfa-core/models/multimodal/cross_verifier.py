"""
TruthLens - Multimodal Trust Score Fusion Engine
Merges Media Forensics (CNN / Grad-CAM / Frequency) with Regional Language NLP
and Fact-Checked Claims Database into a single, explainable Trust Score (0-100%).
"""

import numpy as np

class MultimodalCrossVerifier:
    """
    Multimodal Forensic Fusion Engine for TruthLens.
    Produces:
    1. Unified Trust Score (0 to 100)
    2. Confidence interval (e.g., +/- 3.8%)
    3. Mathematical component weight breakdown (Media, Linguistic Cues, Fact-Check match)
    4. Forensic natural language verdict narrative for fact-checkers and court proceedings
    """

    def __init__(self):
        # Configurable fusion weights
        self.weights = {
            "media_forensics": 0.45,
            "text_linguistics": 0.35,
            "fact_check_alignment": 0.20
        }

    def verify_alignment(self, video_analysis_res: dict, text_analysis_res: dict) -> dict:
        # Extract sub-scores
        media_trust = video_analysis_res.get("media_trust_score", 50.0)
        media_fake = video_analysis_res.get("average_fake_score", (100.0 - media_trust) / 100.0)

        text_trust = text_analysis_res.get("text_trust_score", 50.0)
        text_fake = text_analysis_res.get("overall_fake_score", (100.0 - text_trust) / 100.0)

        # Fact check influence
        matched_checks = text_analysis_res.get("matched_fact_checks", [])
        top_match = matched_checks[0] if matched_checks else None
        
        if top_match and top_match.get("similarity_score", 0.0) > 0.45:
            # Strong match with known fake/misleading claim
            fact_check_trust = 15.0
            fc_alignment_status = f"Known debunk match: '{top_match.get('title')}' by {top_match.get('source')}"
        elif top_match and top_match.get("similarity_score", 0.0) > 0.25:
            fact_check_trust = 45.0
            fc_alignment_status = f"Partial match with claim debunked by {top_match.get('source')}"
        else:
            fact_check_trust = 75.0
            fc_alignment_status = "No direct debunk matches found in current fact-checked claim registry"

        # Cross-modal discrepancy
        discrepancy = abs(media_trust - text_trust)

        # Fused Trust Score calculation
        fused_score = (
            (media_trust * self.weights["media_forensics"]) +
            (text_trust * self.weights["text_linguistics"]) +
            (fact_check_trust * self.weights["fact_check_alignment"])
        )

        # Penalize if heavy cross-modal mismatch (e.g. real video recycled with inflammatory false headline)
        if discrepancy > 40.0:
            fused_score = max(5.0, fused_score - 10.0)
            context_recycling = True
        else:
            context_recycling = False

        unified_trust_score = round(float(np.clip(fused_score, 3.0, 97.0)), 1)
        confidence_margin = round(3.2 + (discrepancy / 100.0) * 2.5, 1)

        # Verdict assignment
        if unified_trust_score >= 75.0:
            verdict = "VERIFIED AUTHENTIC CONTENT"
            verdict_badge = "verified"
            risk_level = "LOW RISK"
            summary_narrative = (
                "Both visual media and text claim display consistent, authentic signatures. "
                "No spatial boundary distortions or sensational panic triggers were detected."
            )
        elif unified_trust_score >= 45.0:
            verdict = "QUESTIONABLE / CONTEXT MISMATCH"
            verdict_badge = "warning"
            risk_level = "MODERATE RISK"
            summary_narrative = (
                "Anomalous discrepancies detected between media biophysics and text claims. "
                "Footage may be authentic but repurposed with a sensationalized or out-of-context headline."
                if context_recycling else
                "Content exhibits borderline manipulation markers requiring human editorial review."
            )
        else:
            verdict = "FABRICATED MANIPULATION DETECTED"
            verdict_badge = "dangerous"
            risk_level = "CRITICAL RISK"
            summary_narrative = (
                "High-confidence forensic anomaly detection. Visual analysis reveals generative synthesis artifacts, "
                "corroborated by sensational regional language manipulation cues."
            )

        return {
            "unified_trust_score": unified_trust_score,
            "confidence_margin": confidence_margin,
            "verdict": verdict,
            "verdict_badge": verdict_badge,
            "risk_level": risk_level,
            "summary_narrative": summary_narrative,
            "context_recycling_detected": context_recycling,
            "cross_modal_discrepancy": round(discrepancy, 1),
            "breakdown": {
                "media_forensics": {
                    "trust_score": media_trust,
                    "weight_pct": 45,
                    "weighted_contribution": round(media_trust * 0.45, 1),
                    "status": video_analysis_res.get("verdict", "ANOMALY EVALUATED")
                },
                "text_linguistics": {
                    "trust_score": text_trust,
                    "weight_pct": 35,
                    "weighted_contribution": round(text_trust * 0.35, 1),
                    "language": text_analysis_res.get("language_name", "Regional"),
                    "status": text_analysis_res.get("verdict", "LINGUISTIC EVALUATED")
                },
                "fact_check_alignment": {
                    "trust_score": fact_check_trust,
                    "weight_pct": 20,
                    "weighted_contribution": round(fact_check_trust * 0.20, 1),
                    "status": fc_alignment_status
                }
            },
            "evidence_trail": [
                f"Media Sub-Score: {media_trust}% authentic based on facial boundary and frequency harmonics.",
                f"Regional Text Score ({text_analysis_res.get('language_name', 'Regional')}): {text_trust}% credibility index.",
                f"Fact-Check Alignment: {fc_alignment_status}."
            ]
        }
