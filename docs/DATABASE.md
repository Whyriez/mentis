# Database

## profiles
- id
- user_id
- full_name
- avatar_url
- role
- daily_goal_minutes
- roadmap_target_months
- total_xp (default: 0)
- current_streak (default: 0, dynamically derived from quiz_attempts)
- longest_streak (default: 0)
- last_active_at
- created_at
- updated_at

## modules
- id
- title
- slug
- description
- difficulty
- order_index

## lessons
- id
- module_id
- title
- content_md
- estimated_minutes
- order_index

## lesson_sections
- id
- lesson_id
- type
- content
- order_index

## questions
- id
- module_id
- lesson_id
- category
- difficulty
- question
- options(json)
- answer
- explanation
- estimated_seconds
- source(ai|admin)

## quiz_attempts
- id
- user_id
- module_id
- started_at
- finished_at
- total_questions
- score

## quiz_answers
- id
- attempt_id
- question_id
- selected_answer
- is_correct
- time_taken_ms

## learning_progress
- id
- user_id
- module_id
- lesson_id
- mastery_percent
- completed

## review_queue
- id
- user_id
- question_id
- next_review_at
- review_count

## roadmaps
- id
- user_id
- target_months
- current_phase
- completion_percent

## roadmap_steps
- id
- roadmap_id
- module_id
- target_accuracy
- target_time_seconds
- completed
