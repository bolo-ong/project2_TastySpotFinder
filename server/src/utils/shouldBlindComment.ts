import { googleClient } from "../app";

const API_KEY = process.env.GOOGLE_API_KEY as string;

interface AnalyzeRequest {
  comment: {
    text: string;
  };
  requestedAttributes: {
    [key: string]: {};
  };
}

interface AnalyzeResponse {
  attributeScores: {
    [key: string]: {
      spanScores: any[];
      summaryScore: {
        value: number;
        type: string;
      };
    };
  };
}

export const shouldBlindComment = async (
  ...texts: string[]
): Promise<boolean> => {
  try {
    if (!googleClient) {
      throw new Error("Google API client not initialized");
    }

    for (const text of texts) {
      const analyzeRequest: AnalyzeRequest = {
        comment: {
          text,
        },
        requestedAttributes: {
          TOXICITY: {},
        },
      };

      const response = await new Promise<AnalyzeResponse>((resolve, reject) => {
        (googleClient.comments.analyze as any)(
          {
            key: API_KEY,
            resource: analyzeRequest,
          },
          (err: Error | null, response: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.data);
            }
          }
        );
      });

      const toxicityScore =
        response.attributeScores.TOXICITY.summaryScore.value;
      if (toxicityScore >= 0.8) {
        return true; // 유해도 점수가 0.8 이상이면 바로 true 반환
      }
    }

    return false; // 모든 텍스트가 유해하지 않으면 false 반환
  } catch (err) {
    // console.error("Error analyzing comment:", err);
    return false; // 에러가 발생한 경우 블라인드 처리하지 않음
  }
};
