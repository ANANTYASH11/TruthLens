import numpy as np

class MultimodalCrossVerifier:
    """
    Multimodal Video + Regional Text Headline Cross-Verifier.
    Detects context manipulation, false attribution, and video-text mismatch.
    """
    def __init__(self):
        pass

    def verify_alignment(self, video_analysis_res, text_analysis_res):
        video_score = video_analysis_res.get("summary", {}).get("fake_score_avg", 0.5)
        text_score = text_analysis_res.get("overall_fake_score", 0.5)
        
        # Cross-modal discrepancy score
        discrepancy = abs(video_score - text_score)
        
        if video_score >= 0.5 and text_score >= 0.5:
            verdict = "HIGH CONFIDENCE MULTIMODAL DEEPFAKE & FAKE NEWS"
            risk_level = "CRITICAL"
        elif video_score < 0.5 and text_score >= 0.5:
            verdict = "REAL FOOTAGE USED WITH MISLEADING REGIONAL HEADLINE (CONTEXT RECYCLING)"
            risk_level = "HIGH"
        elif video_score >= 0.5 and text_score < 0.5:
            verdict = "DEEPFAKE VIDEO CLIPPED WITH NEUTRAL HEADLINE"
            risk_level = "HIGH"
        else:
            verdict = "AUTHENTIC MULTIMODAL MEDIA"
            risk_level = "LOW"
            
        combined_score = round(float(np.clip(0.55 * video_score + 0.45 * text_score + 0.1 * (1.0 if risk_level == "HIGH" else 0.0), 0.05, 0.99)), 4)
        
        return {
            "verdict": verdict,
            "risk_level": risk_level,
            "multimodal_score": combined_score,
            "video_score": video_score,
            "text_score": text_score,
            "cross_modal_discrepancy": round(float(discrepancy), 4),
            "findings": [
                f"Video manipulation score: {video_score * 100:.1f}%.",
                f"Text misinformation score ({text_analysis_res.get('language_name', 'Regional')}): {text_score * 100:.1f}%.",
                f"Cross-modal alignment status: {'MISMATCH DETECTED' if discrepancy > 0.3 else 'CONSISTENT SIGNAL'}."
            ]
        }
