
export enum ContentGoal {
  PersonalStory = "Share a Personal Story/Lesson",
  IndustryInsight = "Provide an Industry Insight",
  EngagingQuestion = "Ask an Engaging Question",
  ProductPromotion = "Promote a Product/Service",
  ArticleShare = "Share an Article/Link",
  Milestone = "Celebrate a Win/Milestone",
}

export enum Tone {
  Inspirational = "Inspirational",
  Professional = "Professional & Authoritative",
  Casual = "Casual & Conversational",
  Contrarian = "Contrarian / Thought-Provoking",
  Technical = "Technical & Data-Driven",
}

export type UserInputs = {
  [key: string]: string;
};
