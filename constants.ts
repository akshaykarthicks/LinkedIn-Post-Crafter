
import { ContentGoal, Tone } from './types';

export const GOALS: ContentGoal[] = [
  ContentGoal.PersonalStory,
  ContentGoal.IndustryInsight,
  ContentGoal.ArticleShare,
  ContentGoal.ProductPromotion,
  ContentGoal.EngagingQuestion,
  ContentGoal.Milestone,
];

export const TONES: Tone[] = [
  Tone.Professional,
  Tone.Inspirational,
  Tone.Casual,
  Tone.Contrarian,
  Tone.Technical,
];

export const GOAL_INPUT_MAP: { [key in ContentGoal]: { label: string; placeholder: string; key: string; type: 'input' | 'textarea' }[] } = {
  [ContentGoal.PersonalStory]: [
    { label: 'The Situation', placeholder: 'e.g., I had a major project fail last year.', key: 'situation', type: 'textarea' },
    { label: 'The Lesson Learned', placeholder: 'e.g., I learned the importance of asking for help early.', key: 'lesson', type: 'textarea' },
  ],
  [ContentGoal.IndustryInsight]: [
    { label: 'Topic', placeholder: 'e.g., The future of AI in marketing.', key: 'topic', type: 'input' },
    { label: 'Your Core Opinion/Insight', placeholder: 'e.g., AI won\'t replace marketers, it will empower them.', key: 'opinion', type: 'textarea' },
  ],
  [ContentGoal.ArticleShare]: [
    { label: 'Article URL', placeholder: 'https://example.com/article', key: 'url', type: 'input' },
    { label: 'Your Key Takeaway or Opinion', placeholder: 'e.g., The most surprising statistic was that 80% of companies haven\'t adopted this yet.', key: 'takeaway', type: 'textarea' },
  ],
  [ContentGoal.ProductPromotion]: [
    { label: 'Product/Service Name', placeholder: 'e.g., Our new analytics dashboard.', key: 'product', type: 'input' },
    { label: 'Key Feature/Benefit', placeholder: 'e.g., It helps users track real-time engagement.', key: 'feature', type: 'input' },
    { label: 'Target Audience Pain Point', placeholder: 'e.g., Wasting hours manually compiling reports.', key: 'painPoint', type: 'input' },
  ],
  [ContentGoal.EngagingQuestion]: [
    { label: 'Topic of the Question', placeholder: 'e.g., Remote work productivity.', key: 'topic', type: 'input' },
    { label: 'Your Brief Stance (optional)', placeholder: 'e.g., I believe hybrid models are the future, but I\'m curious what others think.', key: 'stance', type: 'textarea' },
  ],
  [ContentGoal.Milestone]: [
    { label: 'The Achievement', placeholder: 'e.g., We just reached 10,000 customers!', key: 'achievement', type: 'input' },
    { label: 'Who to Thank (optional)', placeholder: 'e.g., Our amazing team and loyal customers.', key: 'thanks', type: 'input' },
  ],
};
