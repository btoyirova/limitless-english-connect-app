import { ConversationTopic } from '../types';
import { LEVEL_1_TOPICS } from './curriculumLevel1';
import { LEVEL_2_TOPICS } from './curriculumLevel2';
import { LEVEL_3_TOPICS } from './curriculumLevel3';
import { LEVEL_4_TOPICS } from './curriculumLevel4';

/**
 * 20 Comprehensive Pre-A1 to A2 English Speaking Topics
 * Designed for Uzbek students learning English, including blind and low-vision beginner learners.
 * Each topic is organized into separate clickable lessons with structured vocabulary,
 * sentence patterns, dialogues, interactive activities, and end-of-topic tests.
 */
export const CURRICULUM_TOPICS: ConversationTopic[] = [
  ...LEVEL_1_TOPICS,
  ...LEVEL_2_TOPICS,
  ...LEVEL_3_TOPICS,
  ...LEVEL_4_TOPICS,
];
