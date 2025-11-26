# Manual Testing Guide: Kiro Adaptive Assistance

## Overview

This document provides comprehensive manual testing scenarios for the Kiro Adaptive Assistance system. Each scenario tests one of the six user states and validates that the system correctly classifies the state and applies the appropriate response pattern.

## Testing Prerequisites

1. Open `index.html` in a browser
2. Ensure Gemini API key is configured in `js/config.local.js`
3. Open browser console to monitor state classifications and any errors
4. Clear conversation history between major test scenarios (refresh page)

## Test Scenarios

### Scenario 1: Lost Direction (Life Questioning Engine)

**Objective:** Verify the system recognizes when a user lacks direction and activates the Life Questioning Engine pattern.

**Test Steps:**
1. Start a new conversation
2. Send message: "No sé qué estudiar, estoy completamente perdido"
3. Observe the response

**Expected Behavior:**
- State Classification: `LOST_DIRECTION`
- Response Pattern: Life Questioning Engine
- Response should include:
  - Ocean metaphors (olas, corrientes, viento, marea)
  - Progressive questioning approach (not direct advice)
  - Exploration of interests, values, or goals
  - JSON structure with whisper and reflection
  - Calm, mystical tone

**Validation Criteria:**
- [ ] Message classified as LOST_DIRECTION (check console)
- [ ] Response contains ocean metaphors
- [ ] Response asks exploratory questions rather than giving direct answers
- [ ] Response maintains mystical/ocean aesthetic
- [ ] JSON output structure is correct (persona: "kiro", mode: "LOST_DIRECTION")
- [ ] No immediate solutions provided without context gathering

**Additional Test Messages:**
- "¿Qué camino debo seguir en mi vida?"
- "No tengo dirección, todo me parece igual"
- "Estoy perdido y no sé qué hacer con mi futuro"

---

### Scenario 2: Emotional Low (Emotional Soothing Pattern)

**Objective:** Verify the system provides emotional support and validation without pushing into deeper questioning.

**Test Steps:**
1. Start a new conversation
2. Send message: "Me siento muy triste y solo, no puedo más"
3. Observe the response

**Expected Behavior:**
- State Classification: `EMOTIONAL_LOW`
- Response Pattern: Emotional Soothing
- Response should include:
  - Reflection of the user's emotion
  - Normalization of their experience
  - Ocean metaphors about temporary states (olas que vienen y van, marea baja)
  - Gentle, non-pressuring closing question
  - NO activation of Life Questioning mode

**Validation Criteria:**
- [ ] Message classified as EMOTIONAL_LOW (check console)
- [ ] Response reflects and validates the user's emotion
- [ ] Response normalizes the experience (emotions are temporary like waves)
- [ ] Ocean metaphors present and appropriate
- [ ] Closing question is gentle and non-pressuring
- [ ] NO Life Questioning activation
- [ ] NO solutions or action steps provided
- [ ] JSON output structure is correct (mode: "EMOTIONAL_LOW")

**Additional Test Messages:**
- "Estoy agotado, todo está mal"
- "Me siento deprimido y ansioso"
- "Estoy desesperado, nada tiene sentido"

---

### Scenario 3: Seeking Decision (Decision Matrix Pattern)

**Objective:** Verify the system helps users analyze choices rationally while considering emotional impact.

**Test Steps:**
1. Start a new conversation
2. Send message: "No sé si estudiar medicina o ingeniería, ¿cuál es mejor?"
3. Observe the response

**Expected Behavior:**
- State Classification: `SEEKING_DECISION`
- Response Pattern: Decision Matrix
- Response should include:
  - Questions about available options
  - Exploration of what matters most to the user
  - Consideration of consequences without pressure
  - Emotional impact consideration
  - Calm, non-directive tone

**Validation Criteria:**
- [ ] Message classified as SEEKING_DECISION (check console)
- [ ] Response asks about options and values
- [ ] Response explores consequences without directing choice
- [ ] Emotional impact is considered alongside rational analysis
- [ ] Tone is calm and non-pressuring
- [ ] Ocean aesthetic maintained
- [ ] JSON output structure is correct (mode: "SEEKING_DECISION")
- [ ] No definitive "you should choose X" statements

**Additional Test Messages:**
- "¿Debería quedarme en mi trabajo o buscar algo nuevo?"
- "No sé qué opción elegir, ayúdame a decidir"
- "Tengo dos caminos y no sé cuál tomar"

---

### Scenario 4: Need Orientation (Action Roadmap Generator)

**Objective:** Verify the system provides clear, achievable action steps structured by timeframe.

**Test Steps:**
1. Start a new conversation
2. Send message: "¿Qué pasos puedo seguir para mejorar mi situación?"
3. Observe the response

**Expected Behavior:**
- State Classification: `NEED_ORIENTATION`
- Response Pattern: Action Roadmap Generator
- Response should include:
  - 3-5 simple, achievable actions
  - Timeframe structure: today, this week, this month
  - Focusing question at the end to help prioritize
  - Ocean aesthetic maintained

**Validation Criteria:**
- [ ] Message classified as NEED_ORIENTATION (check console)
- [ ] Response provides 3-5 specific actions
- [ ] Actions are structured by timeframe (today/week/month)
- [ ] Actions are simple and achievable (not overwhelming)
- [ ] Closing includes a focusing question
- [ ] Ocean metaphors present
- [ ] JSON output structure is correct (mode: "NEED_ORIENTATION")
- [ ] Actions are practical and concrete

**Additional Test Messages:**
- "¿Cómo empiezo a cambiar mi vida?"
- "Necesito guía práctica, ¿qué hago ahora?"
- "¿Qué puedo hacer para avanzar?"

---

### Scenario 5: Self-Expression (Reflective Mirror Pattern)

**Objective:** Verify the system listens and validates without providing solutions or directing the conversation.

**Test Steps:**
1. Start a new conversation
2. Send message: "Solo necesito desahogarme... hoy fue un día terrible en el trabajo, mi jefe me criticó delante de todos"
3. Observe the response

**Expected Behavior:**
- State Classification: `SELF_EXPRESSION`
- Response Pattern: Reflective Mirror
- Response should include:
  - Reflection of the essence of what user said
  - Validation of their emotion
  - Simple follow-up question that invites continued expression
  - NO solutions or guidance
  - NO action steps or advice

**Validation Criteria:**
- [ ] Message classified as SELF_EXPRESSION (check console)
- [ ] Response reflects back what the user expressed
- [ ] Emotion is validated and acknowledged
- [ ] Follow-up question is simple and inviting
- [ ] NO solutions, advice, or guidance provided
- [ ] Ocean aesthetic maintained
- [ ] JSON output structure is correct (mode: "SELF_EXPRESSION")
- [ ] Response focuses on listening, not fixing

**Additional Test Messages:**
- "Necesito hablar sobre algo que me pasó"
- "Solo quiero compartir esto contigo"
- "Escucha esto que me está molestando"

---

### Scenario 6: Neutral Chat (Neutral Chat Handler)

**Objective:** Verify the system responds appropriately to casual conversation without applying deep patterns.

**Test Steps:**
1. Start a new conversation
2. Send message: "Hola, ¿cómo estás?"
3. Observe the response

**Expected Behavior:**
- State Classification: `NEUTRAL_CHAT`
- Response Pattern: Neutral Chat Handler
- Response should include:
  - Brief, contextually appropriate response
  - Kiro tone maintained
  - No deep patterns applied
  - Standard JSON output structure

**Validation Criteria:**
- [ ] Message classified as NEUTRAL_CHAT (check console)
- [ ] Response is brief and appropriate
- [ ] Kiro voice/tone is maintained
- [ ] No unnecessary depth or pattern application
- [ ] Ocean aesthetic present but subtle
- [ ] JSON output structure is correct (mode: "NEUTRAL_CHAT")
- [ ] System remains ready to detect state changes in next message

**Additional Test Messages:**
- "¿Qué tal el día?"
- "Gracias por tu ayuda"
- "Interesante"

---

## State Transition Testing

### Scenario 7: Emotional Low → Lost Direction Transition

**Objective:** Verify the system smoothly transitions between states and validates emotions before deeper questioning.

**Test Steps:**
1. Start a new conversation
2. Send message: "Me siento muy triste" (EMOTIONAL_LOW)
3. Wait for response
4. Send message: "Ahora que lo pienso, creo que es porque no sé qué hacer con mi vida" (LOST_DIRECTION)
5. Observe both responses

**Expected Behavior:**
- First response: Emotional Soothing Pattern
- Second response: Life Questioning Engine with emotional validation
- Smooth transition without jarring changes
- Context maintained across messages

**Validation Criteria:**
- [ ] First message classified as EMOTIONAL_LOW
- [ ] First response provides emotional support
- [ ] Second message classified as LOST_DIRECTION
- [ ] Second response acknowledges previous emotional state
- [ ] Transition feels natural and supportive
- [ ] Conversation context is maintained
- [ ] No abrupt shift in tone or approach

---

## Ocean Aesthetic Validation Checklist

Use this checklist to validate that the ocean/mystical aesthetic is maintained across all responses:

- [ ] Ocean metaphors present (olas, corrientes, viento, marea, profundidad)
- [ ] Mystical, calm tone maintained
- [ ] Language is poetic but clear
- [ ] Metaphors enhance rather than obscure the message
- [ ] Visual consistency with existing Whispers of the Wave interface
- [ ] Spanish language feels natural and authentic
- [ ] Aesthetic doesn't compromise practical guidance

---

## JSON Output Validation Checklist

Use this checklist to validate the structured output format:

- [ ] Response is valid JSON
- [ ] Contains exactly 5 fields: persona, mode, action, text, next_step
- [ ] `persona` field always contains "kiro"
- [ ] `mode` field contains one of the 6 valid states
- [ ] `action` field specifies the response pattern used
- [ ] `text` object contains both `whisper` and `reflection`
- [ ] `whisper` is 2-4 lines of poetic reflection
- [ ] `reflection` is 1-2 lines of question/insight
- [ ] `next_step` provides internal guidance for conversation flow

---

## Performance Validation

- [ ] State classification completes quickly (< 100ms perceived)
- [ ] Response generation time is comparable to non-adaptive system
- [ ] No noticeable lag or delays in conversation flow
- [ ] Console shows no errors or warnings
- [ ] Memory usage remains stable across multiple messages

---

## Edge Cases to Test

### Empty or Very Short Messages
- Test: "" (empty)
- Test: "ok"
- Test: "..."
- Expected: NEUTRAL_CHAT classification, brief appropriate response

### Very Long Messages
- Test: Multi-paragraph message with multiple topics
- Expected: System identifies primary state, responds appropriately

### Mixed Emotional States
- Test: "Estoy triste pero también emocionado por una oportunidad"
- Expected: EMOTIONAL_LOW takes priority (emotional priority system)

### Rapid Topic Changes
- Test: Send 3 different state messages in quick succession
- Expected: System adapts to each new state appropriately

### Non-Spanish Messages
- Test: "I don't know what to do with my life"
- Expected: System still classifies and responds (multi-language support)

---

## Regression Testing

After implementing the adaptive system, verify these existing features still work:

- [ ] Narrador/Kiro dual persona system functions correctly
- [ ] Existing Life Questioning mode still activates appropriately
- [ ] Conversation history is preserved correctly
- [ ] Emotional tone analysis still works
- [ ] UI displays messages correctly (whisper, wave-reflection, user-message)
- [ ] Typing indicator appears and disappears appropriately
- [ ] Error handling displays ocean-themed error messages
- [ ] Responsive design works on mobile devices

---

## Bug Reporting Template

If you encounter issues during testing, use this template:

**Bug Title:** [Brief description]

**Scenario:** [Which test scenario]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Console Output:**
```
[Paste any console errors or logs]
```

**Screenshots:**
[If applicable]

**Browser/Device:**
[Browser version and device information]

---

## Testing Sign-Off

Once all scenarios pass validation, complete this sign-off:

**Tester Name:** _______________
**Date:** _______________
**Browser Tested:** _______________

**Scenario Results:**
- [ ] Scenario 1: Lost Direction - PASS / FAIL
- [ ] Scenario 2: Emotional Low - PASS / FAIL
- [ ] Scenario 3: Seeking Decision - PASS / FAIL
- [ ] Scenario 4: Need Orientation - PASS / FAIL
- [ ] Scenario 5: Self-Expression - PASS / FAIL
- [ ] Scenario 6: Neutral Chat - PASS / FAIL
- [ ] Scenario 7: State Transition - PASS / FAIL

**Overall Assessment:**
- [ ] All core functionality working
- [ ] Ocean aesthetic maintained
- [ ] JSON output valid
- [ ] Performance acceptable
- [ ] No critical bugs

**Notes:**
[Any additional observations or recommendations]
