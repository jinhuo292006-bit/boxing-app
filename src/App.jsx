import { useState, useEffect, useRef, useCallback } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const WORKOUT_DATA = {
  monday: {
    label: "MONDAY",
    theme: "Strength + Boxing Basics",
    color: "#c0392b",
    sections: [
      {
        name: "Warm-Up (10 min)",
        exercises: [
          { id: "skip1", name: "Skipping Rope", duration: 300, unit: "time", icon: "🪢", cue: "Keep elbows in, light on feet, wrists rotating" },
          { id: "arm1", name: "Arm Circles", duration: 30, unit: "time", icon: "🔄", cue: "Full range, 15 forward then 15 backward" },
          { id: "hip1", name: "Hip Rotations", duration: 30, unit: "time", icon: "🔄", cue: "Hands on hips, full circular motion" },
          { id: "shadow1", name: "Light Shadowboxing", duration: 180, unit: "time", icon: "🥊", cue: "Stay loose, focus on footwork" },
        ],
      },
      {
        name: "Boxing Rounds",
        exercises: [
          { id: "stance1", name: "Stance Movement", sets: 3, duration: 120, unit: "time", icon: "👟", cue: "Orthodox: left foot forward. Stay on balls of feet, knees slightly bent" },
          { id: "jab1", name: "Jab Only", sets: 3, duration: 120, unit: "time", icon: "🥊", cue: "Extend fully, snap back fast. Chin down, lead shoulder protecting jaw" },
          { id: "jabcross1", name: "Jab + Cross", sets: 3, duration: 120, unit: "time", icon: "🥊", cue: "Rotate hips on cross, pivot rear foot. 1-2 rhythm" },
          { id: "rest_boxing", name: "Rest", duration: 45, unit: "time", icon: "⏸️", cue: "Breathe through nose, stay relaxed", isRest: true },
        ],
      },
      {
        name: "Strength Workout",
        exercises: [
          { id: "pullups1", name: "Pull-ups", sets: 5, reps: "Max", icon: "🏋️", cue: "Full dead hang to chin above bar. Scapula retracted at top" },
          { id: "pushups1", name: "Push-ups", sets: 5, reps: 15, icon: "💪", cue: "Elbows at 45°, chest to floor, full lockout at top" },
          { id: "squats1", name: "Squats", sets: 5, reps: 20, icon: "🦵", cue: "Feet shoulder-width, toes out 15°, break parallel" },
          { id: "lunges1", name: "Walking Lunges", sets: 4, reps: "15/leg", icon: "🚶", cue: "Big step, back knee hovers 1 inch from floor" },
          { id: "plank1", name: "Plank", sets: 4, duration: 45, unit: "time", icon: "🧱", cue: "Neutral spine, squeeze glutes and abs. Don't let hips sag" },
        ],
      },
      {
        name: "Karlakattai Training",
        exercises: [
          { id: "kfwd", name: "Forward Swing", sets: 3, duration: 60, unit: "time", icon: "🔮", cue: "Control the swing, maintain upright posture" },
          { id: "kbwd", name: "Backward Swing", sets: 3, duration: 60, unit: "time", icon: "🔮", cue: "Engage shoulders and core throughout" },
          { id: "kcirc", name: "Circular Rotation", sets: 3, duration: 60, unit: "time", icon: "🔮", cue: "Full arm circle, smooth continuous motion" },
        ],
      },
      {
        name: "Neck Workout",
        exercises: [
          { id: "neck_flex_mon", name: "Neck Flexion", sets: 3, reps: 15, icon: "💪", cue: "Chin to chest, slow and controlled. Strengthen the front of your neck for chin-tuck defense." },
          { id: "neck_ext_mon", name: "Neck Extension", sets: 3, reps: 15, icon: "💪", cue: "Head back slowly, feel the stretch in the front. Builds posterior neck strength to absorb punches." },
          { id: "neck_lat_l_mon", name: "Lateral Flexion (Left)", sets: 3, reps: 12, icon: "↙️", cue: "Ear toward left shoulder. Don't rotate — pure side bend. Targets left sternocleidomastoid." },
          { id: "neck_lat_r_mon", name: "Lateral Flexion (Right)", sets: 3, reps: 12, icon: "↘️", cue: "Ear toward right shoulder. Mirror the left side. Balance both sides equally." },
          { id: "neck_rot_mon", name: "Neck Rotation", sets: 3, reps: 12, icon: "🔄", cue: "Turn head left to right slowly. Look over each shoulder fully. Improves defensive head movement." },
          { id: "neck_iso_mon", name: "Isometric Hold", sets: 4, duration: 20, unit: "time", icon: "🧱", cue: "Press palm against forehead, resist with neck. Hold 20 sec. Do all 4 directions: front, back, left, right." },
          { id: "neck_bridge_mon", name: "Wrestler's Bridge", sets: 3, duration: 30, unit: "time", icon: "🤼", cue: "On mat: support weight on top of head, back arched. The #1 exercise for neck strength in combat sports." },
        ],
      },
      {
        name: "Finisher",
        exercises: [
          { id: "stretch_mon", name: "Stretching", duration: 300, unit: "time", icon: "🧘", cue: "Hold each stretch 30 sec, breathe deeply" },
        ],
      },
    ],
  },
  tuesday: {
    label: "TUESDAY",
    theme: "Footwork + Conditioning",
    color: "#e67e22",
    sections: [
      {
        name: "Warm-Up (10 min)",
        exercises: [
          { id: "skip_tue", name: "Skipping Rope", duration: 480, unit: "time", icon: "🪢", cue: "8 minutes continuous — build rhythm and cadence" },
        ],
      },
      {
        name: "Footwork Drills",
        exercises: [
          { id: "fwdbwd", name: "Fwd/Bwd Movement", sets: 5, duration: 60, unit: "time", icon: "👟", cue: "Push off rear foot forward, lead foot back. Stay bouncy" },
          { id: "side", name: "Side Movement", sets: 5, duration: 60, unit: "time", icon: "👟", cue: "Lateral slides, don't cross feet. Maintain guard" },
          { id: "pivot", name: "Pivot Turns", sets: 4, duration: 60, unit: "time", icon: "🔄", cue: "Pivot on lead foot, move to outside of opponent" },
        ],
      },
      {
        name: "Conditioning",
        exercises: [
          { id: "burp_tue", name: "Burpees", sets: 5, reps: 12, icon: "🔥", cue: "Full hip extension at top, chest to floor at bottom" },
          { id: "mtclimb", name: "Mountain Climbers", sets: 4, reps: 30, icon: "🧗", cue: "Hips level, alternate knees to chest explosively" },
          { id: "jumpsquat", name: "Jump Squats", sets: 4, reps: 15, icon: "⚡", cue: "Land softly, absorb with knees. Explode through hips" },
          { id: "hiknees", name: "High Knees", sets: 5, duration: 30, unit: "time", icon: "🦵", cue: "Drive knees to hip height, pump arms" },
        ],
      },
      {
        name: "Core Workout",
        exercises: [
          { id: "legraise", name: "Leg Raises", sets: 4, reps: 15, icon: "🦵", cue: "Lower back flat on floor, control the descent" },
          { id: "ruswist", name: "Russian Twists", sets: 4, reps: 25, icon: "🌀", cue: "Feet off floor, rotate from obliques not arms" },
          { id: "bicycl", name: "Bicycle Crunches", sets: 4, reps: 25, icon: "🚴", cue: "Elbow to opposite knee, extend leg fully" },
        ],
      },
      {
        name: "Finisher",
        exercises: [
          { id: "stretch_tue", name: "Stretching", duration: 300, unit: "time", icon: "🧘", cue: "Focus on hips, calves, and shoulders" },
        ],
      },
    ],
  },
  wednesday: {
    label: "WEDNESDAY",
    theme: "Pull-Up Power + Punch Speed",
    color: "#8e44ad",
    sections: [
      {
        name: "Warm-Up (10 min)",
        exercises: [
          { id: "skip_wed", name: "Skipping Rope", duration: 300, unit: "time", icon: "🪢", cue: "5 min easy pace to warm up joints" },
          { id: "shadow_wed", name: "Shadowboxing", duration: 180, unit: "time", icon: "🥊", cue: "3 min — flow state, no power, just movement" },
        ],
      },
      {
        name: "Pull-Up Session",
        exercises: [
          { id: "widepull", name: "Wide Grip Pull-ups", sets: 4, reps: "Max", icon: "🏋️", cue: "Hands wider than shoulder-width. Lead with chest to bar" },
          { id: "chinup", name: "Chin-ups", sets: 4, reps: "Max", icon: "🏋️", cue: "Supinated grip (palms facing you). Curl elbows to hips" },
          { id: "deadhang", name: "Dead Hang", sets: 3, duration: 30, unit: "time", icon: "🙇", cue: "Full relaxation, decompress spine, strengthen grip" },
        ],
      },
      {
        name: "Punch Speed Rounds",
        exercises: [
          { id: "fastjab", name: "Fast Jab", sets: 6, duration: 20, unit: "time", icon: "⚡", cue: "Maximum hand speed. Snap back faster than you extend" },
          { id: "jabcrossnon", name: "Jab-Cross Nonstop", sets: 6, duration: 20, unit: "time", icon: "🥊", cue: "Relax the shoulder — tension kills speed" },
          { id: "shadowspd", name: "Shadowboxing Speed", sets: 5, duration: 120, unit: "time", icon: "💨", cue: "Full combos, explosive bursts, movement between" },
          { id: "rest_speed", name: "Rest", duration: 25, unit: "time", icon: "⏸️", cue: "20–30 sec rest between rounds", isRest: true },
        ],
      },
      {
        name: "Explosive Strength",
        exercises: [
          { id: "clap", name: "Clap Push-ups", sets: 4, reps: 10, icon: "👏", cue: "Explosive push, clap mid-air, absorb landing softly" },
          { id: "jumplunge", name: "Jump Lunges", sets: 4, reps: "12/leg", icon: "⚡", cue: "Switch legs in air, land in lunge position" },
          { id: "pikepush", name: "Pike Push-ups", sets: 4, reps: 12, icon: "💪", cue: "Hips high, lower head toward floor, mimics overhead press" },
        ],
      },
      {
        name: "Karlakattai Flow",
        exercises: [
          { id: "kflow", name: "Continuous Movement", sets: 5, duration: 120, unit: "time", icon: "🔮", cue: "Flow between swing patterns without stopping" },
        ],
      },
      {
        name: "Neck Workout",
        exercises: [
          { id: "neck_flex_wed", name: "Neck Flexion", sets: 3, reps: 15, icon: "💪", cue: "Chin to chest, slow and controlled. Strengthen the front of your neck for chin-tuck defense." },
          { id: "neck_ext_wed", name: "Neck Extension", sets: 3, reps: 15, icon: "💪", cue: "Head back slowly, feel the stretch in the front. Builds posterior neck strength to absorb punches." },
          { id: "neck_lat_l_wed", name: "Lateral Flexion (Left)", sets: 3, reps: 12, icon: "↙️", cue: "Ear toward left shoulder. Don't rotate — pure side bend. Targets left sternocleidomastoid." },
          { id: "neck_lat_r_wed", name: "Lateral Flexion (Right)", sets: 3, reps: 12, icon: "↘️", cue: "Ear toward right shoulder. Mirror the left side. Balance both sides equally." },
          { id: "neck_rot_wed", name: "Neck Rotation", sets: 3, reps: 12, icon: "🔄", cue: "Turn head left to right slowly. Look over each shoulder fully. Improves defensive head movement." },
          { id: "neck_iso_wed", name: "Isometric Hold", sets: 4, duration: 20, unit: "time", icon: "🧱", cue: "Press palm against forehead, resist with neck. Hold 20 sec. Do all 4 directions: front, back, left, right." },
          { id: "neck_bridge_wed", name: "Wrestler's Bridge", sets: 3, duration: 30, unit: "time", icon: "🤼", cue: "On mat: support weight on top of head, back arched. The #1 exercise for neck strength in combat sports." },
        ],
      },
      {
        name: "Finisher",
        exercises: [
          { id: "stretch_wed", name: "Stretching", duration: 300, unit: "time", icon: "🧘", cue: "Focus on shoulders, lats, and triceps" },
        ],
      },
    ],
  },
  thursday: {
    label: "THURSDAY",
    theme: "Recovery + Technique",
    color: "#27ae60",
    sections: [
      {
        name: "Light Cardio",
        exercises: [
          { id: "jog_thu", name: "Jogging", duration: 900, unit: "time", icon: "🏃", cue: "Easy conversational pace — this is active recovery" },
          { id: "skip_thu", name: "Skipping Rope", duration: 600, unit: "time", icon: "🪢", cue: "Moderate pace, focus on rhythm and form" },
        ],
      },
      {
        name: "Stretching",
        exercises: [
          { id: "fullbody_thu", name: "Full Body Stretching", duration: 1200, unit: "time", icon: "🧘", cue: "Hold each position 30–45 sec. Breathe into the stretch" },
        ],
      },
      {
        name: "Technical Shadowboxing",
        exercises: [
          { id: "techshadow", name: "Technique Shadowboxing", sets: 5, duration: 120, unit: "time", icon: "🥊", cue: "Focus: technique, breathing, defense and footwork. Slow is smooth, smooth is fast" },
        ],
      },
      {
        name: "Focus Points",
        exercises: [
          { id: "relax_drill", name: "Relaxation Drill", duration: 120, unit: "time", icon: "😮‍💨", cue: "Shadowbox with completely loose muscles. Only tighten on impact" },
          { id: "smooth_punch", name: "Smooth Punch Flow", duration: 120, unit: "time", icon: "🌊", cue: "Fluid combinations — no tension, maximum flow" },
          { id: "defense_drill", name: "Defense Drill", duration: 120, unit: "time", icon: "🛡️", cue: "Practice slips, rolls, and blocks in rhythm" },
          { id: "footmov", name: "Foot Movement Patterns", duration: 120, unit: "time", icon: "👟", cue: "Box step, lateral, pivots — connect movement to punches" },
        ],
      },
    ],
  },
  friday: {
    label: "FRIDAY",
    theme: "Explosive Boxer Workout",
    color: "#2980b9",
    sections: [
      {
        name: "Warm-Up",
        exercises: [
          { id: "skip_fri", name: "Skipping Rope", duration: 300, unit: "time", icon: "🪢", cue: "Build pace gradually to prep for explosive work" },
          { id: "dynstretch", name: "Dynamic Stretching", duration: 300, unit: "time", icon: "🧘", cue: "Leg swings, arm swings, hip circles, trunk rotations" },
        ],
      },
      {
        name: "Power Circuit",
        exercises: [
          { id: "pull_fri", name: "Pull-ups", sets: 5, reps: "Max", icon: "🏋️", cue: "Explosive concentric, controlled eccentric (3 sec down)" },
          { id: "explpush", name: "Explosive Push-ups", sets: 5, reps: 12, icon: "💥", cue: "Push as hard as possible — hands should leave the floor" },
          { id: "jumpsquat2", name: "Jump Squats", sets: 5, reps: 20, icon: "⚡", cue: "Maximum height each rep. Fully extend hips at top" },
          { id: "burp_fri", name: "Burpees", sets: 5, reps: 15, icon: "🔥", cue: "No pause between movement — chest to floor, jump to ceiling" },
        ],
      },
      {
        name: "Boxing Combo Rounds",
        exercises: [
          { id: "jabcross_fri", name: "Jab → Cross", sets: 3, duration: 120, unit: "time", icon: "🥊", cue: "Classic 1-2. Power from rotation, not arm" },
          { id: "jabcrosshook", name: "Jab → Cross → Hook", sets: 3, duration: 120, unit: "time", icon: "🥊", cue: "1-2-3. Hook: pivot foot, rotate hip, elbow at 90°" },
          { id: "doublejab", name: "Double Jab → Cross", sets: 3, duration: 120, unit: "time", icon: "🥊", cue: "1-1-2. Second jab is the feint/range-finder" },
          { id: "slip_combo", name: "Slip → Cross → Hook", sets: 3, duration: 120, unit: "time", icon: "🥊", cue: "Slip outside jab, counter cross, finish hook" },
          { id: "rest_fri", name: "Rest", duration: 45, unit: "time", icon: "⏸️", cue: "45 sec between rounds", isRest: true },
        ],
      },
      {
        name: "Karlakattai Shoulder Burnout",
        exercises: [
          { id: "kburnout", name: "Continuous Swings", duration: 300, unit: "time", icon: "🔮", cue: "5 min nonstop — push through the burn, maintain form" },
        ],
      },
      {
        name: "Neck Workout",
        exercises: [
          { id: "neck_flex_fri", name: "Neck Flexion", sets: 3, reps: 15, icon: "💪", cue: "Chin to chest, slow and controlled. Strengthen the front of your neck for chin-tuck defense." },
          { id: "neck_ext_fri", name: "Neck Extension", sets: 3, reps: 15, icon: "💪", cue: "Head back slowly, feel the stretch in the front. Builds posterior neck strength to absorb punches." },
          { id: "neck_lat_l_fri", name: "Lateral Flexion (Left)", sets: 3, reps: 12, icon: "↙️", cue: "Ear toward left shoulder. Don't rotate — pure side bend. Targets left sternocleidomastoid." },
          { id: "neck_lat_r_fri", name: "Lateral Flexion (Right)", sets: 3, reps: 12, icon: "↘️", cue: "Ear toward right shoulder. Mirror the left side. Balance both sides equally." },
          { id: "neck_rot_fri", name: "Neck Rotation", sets: 3, reps: 12, icon: "🔄", cue: "Turn head left to right slowly. Look over each shoulder fully. Improves defensive head movement." },
          { id: "neck_iso_fri", name: "Isometric Hold", sets: 4, duration: 20, unit: "time", icon: "🧱", cue: "Press palm against forehead, resist with neck. Hold 20 sec. Do all 4 directions: front, back, left, right." },
          { id: "neck_bridge_fri", name: "Wrestler's Bridge", sets: 3, duration: 30, unit: "time", icon: "🤼", cue: "On mat: support weight on top of head, back arched. The #1 exercise for neck strength in combat sports." },
        ],
      },
      {
        name: "Finisher",
        exercises: [
          { id: "stretch_fri", name: "Stretching", duration: 300, unit: "time", icon: "🧘", cue: "Full body cool-down, hold each stretch 30+ sec" },
        ],
      },
    ],
  },
  saturday: {
    label: "SATURDAY",
    theme: "Fighter Conditioning Circuit",
    color: "#c0392b",
    sections: [
      {
        name: "Circuit – 6 Rounds",
        exercises: [
          { id: "skip_sat", name: "Skipping Rope", duration: 120, unit: "time", icon: "🪢", cue: "2 min per round — steady cadence" },
          { id: "shadow_sat", name: "Shadowboxing", duration: 120, unit: "time", icon: "🥊", cue: "2 min — mix combos with movement" },
          { id: "pull_sat", name: "Pull-ups", reps: "Max", icon: "🏋️", cue: "Max reps — controlled, full range" },
          { id: "push_sat", name: "Push-ups", reps: 20, icon: "💪", cue: "20 reps — chest to floor every rep" },
          { id: "squat_sat", name: "Squats", reps: 25, icon: "🦵", cue: "25 reps — below parallel, controlled" },
          { id: "burp_sat", name: "Burpees", reps: 12, icon: "🔥", cue: "12 reps — explosive, no rest within set" },
          { id: "plank_sat", name: "Plank", duration: 60, unit: "time", icon: "🧱", cue: "1 min — rigid as a board" },
          { id: "rest_sat", name: "Rest Between Rounds", duration: 60, unit: "time", icon: "⏸️", cue: "1 min rest after each round", isRest: true },
        ],
        note: "6 rounds total",
      },
      {
        name: "Finisher",
        exercises: [
          { id: "stretch_sat", name: "Stretching", duration: 600, unit: "time", icon: "🧘", cue: "10 min full body stretch" },
          { id: "breathe_sat", name: "Deep Breathing", duration: 300, unit: "time", icon: "😮‍💨", cue: "Box breathing: 4 in, 4 hold, 4 out, 4 hold" },
        ],
      },
    ],
  },
  sunday: {
    label: "SUNDAY",
    theme: "Full Rest Day",
    color: "#7f8c8d",
    isRest: true,
    sections: [
      {
        name: "Rest Day Protocol",
        exercises: [
          { id: "rest_full", name: "Full Recovery", duration: 0, icon: "🛌", cue: "Your body grows during rest — this day is as important as training" },
          { id: "sleep", name: "Good Sleep (8 hours)", duration: 0, icon: "😴", cue: "Prioritize 8 hours of quality sleep" },
          { id: "eat_healthy", name: "Eat Healthy", duration: 0, icon: "🥗", cue: "High protein, complex carbs, healthy fats" },
          { id: "light_stretch", name: "Light Stretching (optional)", duration: 0, icon: "🧘", cue: "Gentle mobility work only if needed" },
        ],
      },
    ],
  },
};

const KNUCKLE_CONDITIONING = [
  { week: "1-2", drill: "Rice Bucket Plunge", duration: 120, desc: "Plunge fists into uncooked rice, open/close hands. Builds tendon strength." },
  { week: "3-4", drill: "Towel Push-ups", duration: 60, reps: 10, desc: "Push-ups on knuckles on a soft towel. Aligns knuckles, builds bone density." },
  { week: "5-6", drill: "Hardwood Knuckle Push-ups", duration: 60, reps: 15, desc: "Knuckle push-ups on hardwood floor. Increases bone density." },
  { week: "7-8", drill: "Light Bag Work", duration: 120, desc: "Controlled hits on a heavy bag with hand wraps. Full knuckle conditioning." },
];

const NECK_WORKOUT = [
  { id: "neck_flex", name: "Neck Flexion", sets: 3, reps: 15, icon: "💪", cue: "Chin to chest, slow and controlled. Strengthen the front of your neck for chin-tuck defense." },
  { id: "neck_ext", name: "Neck Extension", sets: 3, reps: 15, icon: "💪", cue: "Head back slowly, feel the stretch in the front. Builds posterior neck strength to absorb punches." },
  { id: "neck_lat_l", name: "Lateral Flexion (Left)", sets: 3, reps: 12, icon: "↙️", cue: "Ear toward left shoulder. Don't rotate — pure side bend. Targets left sternocleidomastoid." },
  { id: "neck_lat_r", name: "Lateral Flexion (Right)", sets: 3, reps: 12, icon: "↘️", cue: "Ear toward right shoulder. Mirror the left side. Balance both sides equally." },
  { id: "neck_rot", name: "Neck Rotation", sets: 3, reps: 12, icon: "🔄", cue: "Turn head left to right slowly. Look over each shoulder fully. Improves defensive head movement." },
  { id: "neck_iso", name: "Isometric Hold", sets: 4, duration: 20, unit: "time", icon: "🧱", cue: "Press palm against forehead, resist with neck. Hold 20 sec. Do all 4 directions: front, back, left, right." },
  { id: "neck_bridge", name: "Wrestler's Bridge", sets: 3, duration: 30, unit: "time", icon: "🤼", cue: "On mat: support weight on top of head, back arched. The #1 exercise for neck strength in combat sports." },
];

const RECOVERY_STRETCHES = [
  { name: "Hip Flexor Stretch", duration: 60, muscle: "Hip Flexors", cue: "Lunge position, push hips forward, feel the front of hip" },
  { name: "Chest Opener", duration: 45, muscle: "Chest/Shoulders", cue: "Arms behind, clasp hands, squeeze shoulder blades" },
  { name: "Lat Stretch", duration: 45, muscle: "Lats", cue: "Arm overhead bent, pull elbow across. Lean away" },
  { name: "Hamstring Stretch", duration: 60, muscle: "Hamstrings", cue: "Straight leg, hinge at hip, feel behind the knee" },
  { name: "Shoulder Cross Stretch", duration: 30, muscle: "Rear Deltoid", cue: "Pull arm across chest, hold at elbow" },
  { name: "Neck Rolls", duration: 30, muscle: "Neck", cue: "Gentle slow circles, feel each side" },
  { name: "Quad Stretch", duration: 45, muscle: "Quadriceps", cue: "Stand on one leg, pull heel to glute" },
  { name: "Spinal Twist", duration: 45, muscle: "Spine/Obliques", cue: "Seated, one knee bent, rotate toward knee" },
];

const DIET_PLANS = {
  "lose fat": {
    calories: "Deficit 300-500 kcal from TDEE",
    meals: [
      { time: "7:00 AM", meal: "Oats + banana + 2 boiled eggs", macros: "P:25g C:55g F:10g" },
      { time: "10:00 AM", meal: "Greek yogurt + almonds", macros: "P:20g C:15g F:8g" },
      { time: "1:00 PM", meal: "Chicken breast + brown rice + veggies", macros: "P:45g C:60g F:8g" },
      { time: "4:00 PM (Pre-WO)", meal: "Banana + peanut butter", macros: "P:7g C:30g F:8g" },
      { time: "7:00 PM (Post-WO)", meal: "Whey protein + sweet potato", macros: "P:30g C:40g F:3g" },
      { time: "9:00 PM", meal: "Cottage cheese + berries", macros: "P:25g C:20g F:4g" },
    ],
  },
  "build muscle": {
    calories: "Surplus 300-400 kcal from TDEE",
    meals: [
      { time: "7:00 AM", meal: "5 eggs scrambled + toast + OJ", macros: "P:35g C:65g F:20g" },
      { time: "10:00 AM", meal: "Protein shake + banana + oats", macros: "P:35g C:65g F:8g" },
      { time: "1:00 PM", meal: "Salmon + quinoa + broccoli", macros: "P:50g C:55g F:18g" },
      { time: "4:00 PM (Pre-WO)", meal: "Rice cakes + peanut butter + honey", macros: "P:8g C:45g F:10g" },
      { time: "7:00 PM (Post-WO)", meal: "Whey + pasta + lean beef", macros: "P:60g C:80g F:12g" },
      { time: "9:00 PM", meal: "Casein protein + milk", macros: "P:30g C:20g F:5g" },
    ],
  },
  "improve performance": {
    calories: "Maintenance + carb timing",
    meals: [
      { time: "7:00 AM", meal: "Steel-cut oats + eggs + fruit", macros: "P:30g C:70g F:12g" },
      { time: "10:00 AM", meal: "Mixed nuts + apple", macros: "P:8g C:30g F:14g" },
      { time: "1:00 PM", meal: "Turkey wrap + avocado", macros: "P:40g C:55g F:16g" },
      { time: "4:00 PM (Pre-WO)", meal: "White rice + chicken + banana", macros: "P:35g C:80g F:5g" },
      { time: "7:00 PM (Post-WO)", meal: "Whey protein + rice + veggies", macros: "P:45g C:75g F:6g" },
      { time: "9:00 PM", meal: "Greek yogurt + honey + nuts", macros: "P:22g C:25g F:10g" },
    ],
  },
};

// ── SILHOUETTE SVGs for exercises ─────────────────────────────────────────────
const ExerciseSVG = ({ exerciseName, dark }) => {
  const color = dark ? "#e2e8f0" : "#1a1a2e";
  const accent = "#e74c3c";

  const svgs = {
    default: (
      <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <circle cx="100" cy="40" r="25" fill={color} opacity="0.9" />
        <rect x="75" y="70" width="50" height="100" rx="10" fill={color} opacity="0.85" />
        <rect x="40" y="75" width="30" height="80" rx="8" fill={color} opacity="0.75" />
        <rect x="130" y="75" width="30" height="80" rx="8" fill={color} opacity="0.75" />
        <rect x="78" y="168" width="22" height="80" rx="8" fill={color} opacity="0.8" />
        <rect x="100" y="168" width="22" height="80" rx="8" fill={color} opacity="0.8" />
      </svg>
    ),
    boxing: (
      <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <circle cx="90" cy="38" r="22" fill={color} opacity="0.9" />
        <rect x="72" y="65" width="44" height="95" rx="10" fill={color} opacity="0.85" />
        {/* Lead arm punching */}
        <rect x="30" y="68" width="80" height="22" rx="11" fill={accent} opacity="0.9" />
        {/* Rear guard */}
        <rect x="116" y="72" width="25" height="60" rx="8" fill={color} opacity="0.75" />
        {/* Legs in stance */}
        <rect x="65" y="158" width="20" height="90" rx="8" fill={color} opacity="0.8" transform="rotate(-5 65 158)" />
        <rect x="95" y="158" width="20" height="90" rx="8" fill={color} opacity="0.8" transform="rotate(5 95 158)" />
        {/* Gloves */}
        <ellipse cx="28" cy="68" rx="16" ry="12" fill={accent} opacity="0.95" />
      </svg>
    ),
    pullup: (
      <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        {/* Bar */}
        <rect x="20" y="20" width="160" height="10" rx="5" fill={color} opacity="0.6" />
        {/* Arms */}
        <rect x="55" y="28" width="15" height="60" rx="7" fill={accent} opacity="0.9" />
        <rect x="130" y="28" width="15" height="60" rx="7" fill={accent} opacity="0.9" />
        {/* Head */}
        <circle cx="100" cy="105" r="22" fill={color} opacity="0.9" />
        {/* Torso */}
        <rect x="80" y="128" width="40" height="80" rx="10" fill={color} opacity="0.85" />
        {/* Legs together */}
        <rect x="85" y="205" width="18" height="70" rx="8" fill={color} opacity="0.8" />
        <rect x="100" y="205" width="18" height="70" rx="8" fill={color} opacity="0.8" />
      </svg>
    ),
    pushup: (
      <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        {/* Ground */}
        <rect x="0" y="155" width="280" height="8" rx="4" fill={color} opacity="0.3" />
        {/* Body horizontal */}
        <rect x="50" y="100" width="160" height="28" rx="12" fill={color} opacity="0.85" />
        {/* Head */}
        <circle cx="225" cy="100" r="22" fill={color} opacity="0.9" />
        {/* Arms */}
        <rect x="70" y="110" width="15" height="45" rx="7" fill={accent} opacity="0.9" />
        <rect x="140" y="110" width="15" height="45" rx="7" fill={accent} opacity="0.9" />
        {/* Legs */}
        <rect x="30" y="110" width="28" height="45" rx="8" fill={color} opacity="0.8" />
      </svg>
    ),
    squat: (
      <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <circle cx="100" cy="40" r="22" fill={color} opacity="0.9" />
        {/* Leaning torso */}
        <rect x="80" y="62" width="40" height="70" rx="10" fill={color} opacity="0.85" transform="rotate(10 80 62)" />
        {/* Arms extended for balance */}
        <rect x="20" y="100" width="60" height="14" rx="7" fill={color} opacity="0.75" />
        <rect x="120" y="100" width="60" height="14" rx="7" fill={color} opacity="0.75" />
        {/* Thighs parallel to ground */}
        <rect x="60" y="130" width="70" height="18" rx="9" fill={accent} opacity="0.9" />
        {/* Shins */}
        <rect x="55" y="148" width="18" height="70" rx="8" fill={color} opacity="0.8" transform="rotate(-15 55 148)" />
        <rect x="115" y="148" width="18" height="70" rx="8" fill={color} opacity="0.8" transform="rotate(15 115 148)" />
      </svg>
    ),
    plank: (
      <svg viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <rect x="0" y="140" width="300" height="8" rx="4" fill={color} opacity="0.3" />
        {/* Body straight */}
        <rect x="40" y="88" width="185" height="28" rx="12" fill={color} opacity="0.85" />
        {/* Head */}
        <circle cx="240" cy="92" r="22" fill={color} opacity="0.9" />
        {/* Forearms on ground */}
        <rect x="60" y="115" width="14" height="28" rx="7" fill={accent} opacity="0.9" />
        <rect x="120" y="115" width="14" height="28" rx="7" fill={accent} opacity="0.9" />
        {/* Feet */}
        <rect x="28" y="108" width="28" height="14" rx="6" fill={color} opacity="0.8" />
      </svg>
    ),
    skip: (
      <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <circle cx="100" cy="38" r="22" fill={color} opacity="0.9" />
        <rect x="82" y="62" width="36" height="80" rx="10" fill={color} opacity="0.85" />
        {/* Arms out holding rope */}
        <rect x="20" y="90" width="58" height="14" rx="7" fill={color} opacity="0.75" />
        <rect x="122" y="90" width="58" height="14" rx="7" fill={color} opacity="0.75" />
        {/* Rope */}
        <path d="M 22 100 Q 100 160 178 100" stroke={accent} strokeWidth="4" fill="none" strokeDasharray="6 3" />
        {/* Legs - jumping */}
        <rect x="80" y="140" width="18" height="60" rx="8" fill={color} opacity="0.8" transform="rotate(-10 80 140)" />
        <rect x="102" y="140" width="18" height="60" rx="8" fill={color} opacity="0.8" transform="rotate(10 102 140)" />
      </svg>
    ),
    stretch: (
      <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <circle cx="100" cy="42" r="22" fill={color} opacity="0.9" />
        <rect x="82" y="66" width="36" height="75" rx="10" fill={color} opacity="0.85" />
        {/* Arms stretched overhead */}
        <rect x="88" y="10" width="14" height="56" rx="7" fill={accent} opacity="0.9" />
        {/* Legs split */}
        <rect x="72" y="140" width="18" height="90" rx="8" fill={color} opacity="0.8" transform="rotate(-20 72 140)" />
        <rect x="110" y="140" width="18" height="90" rx="8" fill={color} opacity="0.8" transform="rotate(20 110 140)" />
      </svg>
    ),
    burpee: (
      <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <circle cx="100" cy="35" r="22" fill={color} opacity="0.9" />
        {/* Arms raised */}
        <rect x="52" y="20" width="14" height="60" rx="7" fill={accent} opacity="0.9" transform="rotate(-30 52 20)" />
        <rect x="134" y="20" width="14" height="60" rx="7" fill={accent} opacity="0.9" transform="rotate(30 134 20)" />
        <rect x="82" y="58" width="36" height="80" rx="10" fill={color} opacity="0.85" />
        {/* Legs jumping */}
        <rect x="75" y="138" width="20" height="80" rx="8" fill={color} opacity="0.8" transform="rotate(-8 75 138)" />
        <rect x="105" y="138" width="20" height="80" rx="8" fill={color} opacity="0.8" transform="rotate(8 105 138)" />
      </svg>
    ),
  };

  const n = exerciseName?.toLowerCase() || "";
  let key = "default";
  if (n.includes("jab") || n.includes("cross") || n.includes("hook") || n.includes("punch") || n.includes("shadow") || n.includes("boxing") || n.includes("combo") || n.includes("slip")) key = "boxing";
  else if (n.includes("pull-up") || n.includes("chin") || n.includes("hang")) key = "pullup";
  else if (n.includes("push-up") || n.includes("push up") || n.includes("clap") || n.includes("pike")) key = "pushup";
  else if (n.includes("squat") || n.includes("lunge")) key = "squat";
  else if (n.includes("plank") || n.includes("mountain")) key = "plank";
  else if (n.includes("skip") || n.includes("rope") || n.includes("jump rope")) key = "skip";
  else if (n.includes("stretch") || n.includes("yoga") || n.includes("breathing")) key = "stretch";
  else if (n.includes("burpee")) key = "burpee";

  return svgs[key];
};

// ── BMI + AGE CALC ─────────────────────────────────────────────────────────────
const calcBMI = (weight, height) => {
  const h = height / 100;
  return (weight / (h * h)).toFixed(1);
};

const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { label: "Underweight", color: "#3498db" };
  if (bmi < 25) return { label: "Normal", color: "#27ae60" };
  if (bmi < 30) return { label: "Overweight", color: "#e67e22" };
  return { label: "Obese", color: "#e74c3c" };
};

// ── DAYS ─────────────────────────────────────────────────────────────────────
const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function BoxingApp() {
  const [dark, setDark] = useState(true);
  const [screen, setScreen] = useState("register"); // register | home | workout | active | recovery | diet | goals | knuckle | progress
  const [user, setUser] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [weekNumber, setWeekNumber] = useState(1);
  const [prs, setPrs] = useState({});
  const [streak, setStreak] = useState(7);
  const intervalRef = useRef(null);
  const voiceAlertsRef = useRef(new Set()); // track which alerts have fired per timer session

  // ── PERSIST + RESTORE USER ───────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ironfist_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setScreen("home");
      }
    } catch (_) { }

    // Load Google Identity Services SDK
    if (!document.getElementById("google-gsi-script")) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  const loginUser = (userData) => {
    try { localStorage.setItem("ironfist_user", JSON.stringify(userData)); } catch (_) { }
    setUser(userData);
    setScreen("home");
  };

  const logoutUser = () => {
    try { localStorage.removeItem("ironfist_user"); } catch (_) { }
    setUser(null);
    setScreen("register");
  };

  const todayIdx = new Date().getDay();
  const todayKey = DAYS[todayIdx];

  // theme tokens
  const T = {
    bg: dark ? "#0d0d1a" : "#f0f4ff",
    card: dark ? "#141428" : "#ffffff",
    card2: dark ? "#1a1a35" : "#f8f9ff",
    border: dark ? "#2a2a4a" : "#e0e5ff",
    text: dark ? "#e8eaf6" : "#0d0d2b",
    sub: dark ? "#8888aa" : "#6677aa",
    accent: "#e74c3c",
    accent2: "#f39c12",
    accent3: "#3498db",
    green: "#27ae60",
    purple: "#8e44ad",
  };

  // ── VOICE ALERT HELPER ───────────────────────────────────────────────────────
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.95;
    utt.pitch = 1.1;
    utt.volume = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  }, []);

  // Timer logic + voice alerts
  useEffect(() => {
    if (running && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(t => {
          const next = t - 1;
          if (!voiceAlertsRef.current.has(next)) {
            if (next === 120) {
              voiceAlertsRef.current.add(next);
              setTimeout(() => speak("2 minutes remaining"), 0);
            } else if (next === 60) {
              voiceAlertsRef.current.add(next);
              setTimeout(() => speak("1 minute remaining"), 0);
            } else if (next > 0 && next % 60 === 0) {
              voiceAlertsRef.current.add(next);
              setTimeout(() => speak(`${next / 60} minutes remaining`), 0);
            } else if (next === 10) {
              voiceAlertsRef.current.add(next);
              setTimeout(() => speak("10 seconds"), 0);
            } else if (next === 3) {
              voiceAlertsRef.current.add(next);
              setTimeout(() => speak("3"), 0);
            } else if (next === 2) {
              voiceAlertsRef.current.add(next);
              setTimeout(() => speak("2"), 0);
            } else if (next === 1) {
              voiceAlertsRef.current.add(next);
              setTimeout(() => speak("1"), 0);
            }
          }
          return next;
        });
      }, 1000);
    } else if (timer === 0 && running) {
      setRunning(false);
      speak("Time's up! Great work!");
    }
    return () => clearInterval(intervalRef.current);
  }, [running, timer, speak]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // get all exercises flat for active workout
  const getFlatExercises = (dayKey) => {
    const day = WORKOUT_DATA[dayKey];
    return day.sections.flatMap(s => s.exercises);
  };

  const startWorkout = (dayKey) => {
    const exs = getFlatExercises(dayKey);
    setActiveWorkout({ dayKey, exercises: exs });
    setCurrentExerciseIdx(0);
    setCurrentSet(1);
    setRepCount(0);
    voiceAlertsRef.current = new Set();
    const first = exs[0];
    setTimer(first.duration || 0);
    setRunning(false);
    setScreen("active");
  };

  const nextExercise = () => {
    const exs = activeWorkout.exercises;
    if (currentExerciseIdx < exs.length - 1) {
      const next = exs[currentExerciseIdx + 1];
      setCurrentExerciseIdx(i => i + 1);
      setCurrentSet(1);
      setRepCount(0);
      voiceAlertsRef.current = new Set();
      setTimer(next.duration || 0);
      setRunning(false);
    } else {
      setScreen("home");
      setActiveWorkout(null);
    }
  };

  const prevExercise = () => {
    if (currentExerciseIdx > 0) {
      const prev = activeWorkout.exercises[currentExerciseIdx - 1];
      setCurrentExerciseIdx(i => i - 1);
      setTimer(prev.duration || 0);
      setRunning(false);
    }
  };

  const progress = activeWorkout ? ((currentExerciseIdx) / activeWorkout.exercises.length) * 100 : 0;

  // ── STYLES ───────────────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Rajdhani', sans-serif; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #e74c3c44; border-radius: 4px; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
    @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes glow { 0%,100%{box-shadow:0 0 10px #e74c3c44} 50%{box-shadow:0 0 30px #e74c3c88} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes countPulse { 0%{transform:scale(1)} 50%{transform:scale(1.08)} 100%{transform:scale(1)} }
  `;

  const s = {
    app: { background: T.bg, minHeight: "100vh", color: T.text, fontFamily: "'Rajdhani', sans-serif", transition: "all 0.3s" },
    header: { background: dark ? "linear-gradient(90deg,#0d0d1a,#1a0010)" : "linear-gradient(90deg,#1a1a4e,#0d1140)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 100 },
    logo: { fontFamily: "'Bebas Neue'", fontSize: 28, color: T.accent, letterSpacing: 3, lineHeight: 1 },
    logoSub: { fontFamily: "'Rajdhani'", fontSize: 11, color: T.sub, letterSpacing: 4, textTransform: "uppercase" },
    toggle: { background: dark ? "#1a1a35" : "#dde3ff", border: `1px solid ${T.border}`, borderRadius: 20, padding: "6px 14px", color: T.text, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" },
    nav: { display: "flex", gap: 4, overflowX: "auto", padding: "8px 16px", background: T.card, borderBottom: `1px solid ${T.border}` },
    navBtn: (active) => ({ background: active ? T.accent : "transparent", color: active ? "#fff" : T.sub, border: active ? "none" : `1px solid ${T.border}`, borderRadius: 8, padding: "5px 14px", cursor: "pointer", fontSize: 12, fontFamily: "'Rajdhani'", fontWeight: 700, letterSpacing: 1, whiteSpace: "nowrap", transition: "all 0.2s" }),
    card: { background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, marginBottom: 16, animation: "slideUp 0.3s ease" },
    sectionTitle: { fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 2, color: T.accent, marginBottom: 10 },
    badge: (color) => ({ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, letterSpacing: 1 }),
    btn: (color, outline) => ({ background: outline ? "transparent" : color, color: outline ? color : "#fff", border: `2px solid ${color}`, borderRadius: 10, padding: "10px 22px", cursor: "pointer", fontFamily: "'Rajdhani'", fontWeight: 700, fontSize: 15, letterSpacing: 1, transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 6 }),
    input: { background: T.card2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", color: T.text, fontFamily: "'Rajdhani'", fontSize: 16, width: "100%", outline: "none", marginBottom: 4 },
    label: { fontSize: 12, fontWeight: 700, letterSpacing: 2, color: T.sub, textTransform: "uppercase", display: "block", marginBottom: 4, marginTop: 12 },
    exRow: (isRest) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${T.border}22`, opacity: isRest ? 0.7 : 1 }),
    stat: { textAlign: "center" },
    statN: { fontFamily: "'Bebas Neue'", fontSize: 36, color: T.accent, lineHeight: 1 },
    statL: { fontSize: 11, color: T.sub, letterSpacing: 2, textTransform: "uppercase" },
  };

  const ActiveTimer = () => {
    if (!activeWorkout) return null;
    const ex = activeWorkout.exercises[currentExerciseIdx];
    const pct = ex.duration ? ((ex.duration - timer) / ex.duration) * 100 : (repCount / (ex.reps === "Max" ? 20 : parseInt(ex.reps || 1))) * 100;
    const totalSets = ex.sets || 1;
    const isDone = ex.duration ? timer === 0 : repCount >= (ex.reps === "Max" ? 1 : parseInt(ex.reps || 1));

    return (
      <div style={{ ...s.app, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ background: dark ? "#0a0a18" : "#1a1a4e", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => { setRunning(false); setScreen("home"); }} style={{ ...s.btn(T.accent, true), padding: "6px 14px", fontSize: 13 }}>✕ Exit</button>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 16, color: "#fff", letterSpacing: 2 }}>
            {WORKOUT_DATA[activeWorkout.dayKey].label}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: T.accent2 }}>
            {currentExerciseIdx + 1}/{activeWorkout.exercises.length}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: T.border }}>
          <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.accent2})`, transition: "width 0.5s" }} />
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
          {/* Exercise name */}
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            {ex.isRest && <div style={{ ...s.badge(T.accent3), display: "inline-block", marginBottom: 6 }}>REST PERIOD</div>}
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 36, letterSpacing: 3, color: ex.isRest ? T.accent3 : T.text, lineHeight: 1 }}>{ex.name}</div>
            {ex.sets && <div style={{ color: T.sub, fontSize: 14, marginTop: 4, letterSpacing: 2 }}>SET {currentSet} OF {totalSets}</div>}
          </div>

          {/* SVG illustration */}
          <div style={{ width: 220, height: 220, margin: "0 auto 20px", background: dark ? "#ffffff08" : "#0000000a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${T.border}`, animation: running ? "glow 2s infinite" : "none" }}>
            <div style={{ width: 160, height: 180 }}>
              <ExerciseSVG exerciseName={ex.name} dark={dark} />
            </div>
          </div>

          {/* Timer or Reps */}
          {ex.unit === "time" ? (
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 72, color: timer < 10 ? T.accent : T.text, lineHeight: 1, animation: running && timer <= 5 ? "countPulse 0.5s infinite" : "none" }}>{fmt(timer)}</div>
              <div style={{ fontSize: 12, color: T.sub, letterSpacing: 3, marginTop: 4 }}>REMAINING</div>
              {/* Circular progress */}
              <div style={{ margin: "12px auto", width: 80, height: 6, background: T.border, borderRadius: 3 }}>
                <div style={{ width: `${pct}%`, height: "100%", background: timer < 10 ? T.accent : T.green, borderRadius: 3, transition: "width 1s linear" }} />
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: T.sub, marginBottom: 4 }}>TARGET REPS</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 72, color: T.accent2, lineHeight: 1 }}>{ex.reps}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 16 }}>
                <button onClick={() => setRepCount(r => Math.max(0, r - 1))} style={{ ...s.btn(T.accent, true), width: 50, height: 50, borderRadius: "50%", justifyContent: "center", fontSize: 20 }}>−</button>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 52, color: T.text, width: 80, textAlign: "center" }}>{repCount}</div>
                <button onClick={() => setRepCount(r => r + 1)} style={{ ...s.btn(T.green, false), width: 50, height: 50, borderRadius: "50%", justifyContent: "center", fontSize: 20 }}>+</button>
              </div>
              <div style={{ fontSize: 12, color: T.sub, letterSpacing: 2, marginTop: 4 }}>COMPLETED</div>
            </div>
          )}

          {/* Form cue */}
          <div style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: T.accent2, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>🎯 FORM CUE</div>
            <div style={{ fontSize: 15, color: T.text, lineHeight: 1.5 }}>{ex.cue}</div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={prevExercise} disabled={currentExerciseIdx === 0} style={{ ...s.btn(T.sub, true), opacity: currentExerciseIdx === 0 ? 0.4 : 1 }}>← Prev</button>
            {ex.unit === "time" && (
              <button
                onClick={() => {
                  if (timer === 0) { voiceAlertsRef.current = new Set(); setTimer(ex.duration); setRunning(false); }
                  else setRunning(r => !r);
                }}
                style={{ ...s.btn(running ? T.accent2 : T.green, false), minWidth: 120, justifyContent: "center", animation: running ? "none" : "glow 2s infinite" }}
              >
                {timer === 0 ? "↺ Redo" : running ? "⏸ Pause" : "▶ Start"}
              </button>
            )}
            <button
              onClick={() => {
                if (ex.sets && currentSet < totalSets) {
                  setCurrentSet(s => s + 1);
                  setRepCount(0);
                  voiceAlertsRef.current = new Set();
                  setTimer(ex.duration || 0);
                  setRunning(false);
                } else {
                  nextExercise();
                }
              }}
              style={{ ...s.btn(T.accent, false) }}
            >
              {ex.sets && currentSet < totalSets ? `Next Set →` : currentExerciseIdx === activeWorkout.exercises.length - 1 ? "✓ Finish" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── REGISTER SCREEN ─────────────────────────────────────────────────────────
  const RegisterScreen = () => {
    const [form, setForm] = useState({ name: "", email: "", gender: "male", age: "", height: "", weight: "", goal: "improve performance", experience: "beginner" });
    const [step, setStep] = useState(0);
    const bmi = form.height && form.weight ? calcBMI(form.weight, form.height) : null;
    const bmiCat = bmi ? getBMICategory(bmi) : null;

    const steps = [
      { title: "WHO ARE YOU?", fields: ["name", "email", "gender", "age"] },
      { title: "YOUR BODY", fields: ["height", "weight"] },
      { title: "YOUR MISSION", fields: ["goal", "experience"] },
    ];

    const submit = () => {
      loginUser({ ...form, bmi, joinDate: new Date().toISOString() });
    };

    const handleGoogleSignIn = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: "227538733566-ma286c51m2h95eqcpjs41ttguqnhee72.apps.googleusercontent.com",
          callback: (response) => {
            // Decode JWT payload (no sensitive ops needed here)
            try {
              const payload = JSON.parse(atob(response.credential.split(".")[1]));
              loginUser({
                name: payload.name || "Fighter",
                email: payload.email || "",
                gender: "other",
                age: "",
                height: "",
                weight: "",
                goal: "improve performance",
                experience: "beginner",
                bmi: null,
                joinDate: new Date().toISOString(),
                googleAvatar: payload.picture || "",
                googleSub: payload.sub,
              });
            } catch (_) { alert("Google sign-in failed. Please try manual registration."); }
          },
        });
        window.google.accounts.id.prompt();
      } else {
        alert("Google Sign-In is loading… please try again in a moment.");
      }
    };

    return (
      <div style={{ ...s.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 24 }}>
        <div style={{ maxWidth: 440, width: "100%" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 52, color: T.accent, letterSpacing: 4, lineHeight: 1 }}>IRON FIST</div>
            <div style={{ fontFamily: "'Rajdhani'", fontSize: 12, color: T.sub, letterSpacing: 6, textTransform: "uppercase" }}>Boxing & Fitness</div>
            <div style={{ marginTop: 16, fontSize: 48 }}>🥊</div>
          </div>

          {/* Google Sign-In */}
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={handleGoogleSignIn}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, background: "#fff", color: "#1f1f1f", border: "1px solid #ddd", borderRadius: 10, padding: "12px 20px", cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.12)", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)"}
            >
              <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.2 33.2 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6-6C34.3 6.4 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.4-.1-2.7-.2-4z" /><path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.5 19.2 14 24 14c3 0 5.7 1.1 7.8 2.9l6-6C34.3 6.4 29.4 4 24 4c-7.8 0-14.5 4.5-17.7 10.7z" /><path fill="#FBBC05" d="M24 44c5.4 0 10.3-1.9 14.1-5.1l-6.5-5.3C29.6 35.4 27 36 24 36c-5.6 0-10.3-3.8-11.7-9l-7 5.4C8.5 39.5 15.7 44 24 44z" /><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-.8 2.3-2.3 4.3-4.3 5.7l6.5 5.3c3.8-3.5 6.1-8.7 6.1-15.1 0-1.4-.1-2.7-.2-4z" /></svg>
              Continue with Google
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0 0" }}>
              <div style={{ flex: 1, height: 1, background: T.border }} />
              <div style={{ fontSize: 12, color: T.sub, letterSpacing: 2 }}>OR REGISTER MANUALLY</div>
              <div style={{ flex: 1, height: 1, background: T.border }} />
            </div>
          </div>

          {/* Step indicator */}
          <div style={{ display: "flex", gap: 6, marginBottom: 28, justifyContent: "center" }}>
            {steps.map((st, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? T.accent : T.border, transition: "all 0.3s" }} />
            ))}
          </div>

          <div style={{ ...s.card, padding: 28 }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: 3, color: T.text, marginBottom: 20 }}>{steps[step].title}</div>

            {step === 0 && (
              <>
                <label style={s.label}>Fighter Name</label>
                <input style={s.input} placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <label style={s.label}>Email</label>
                <input style={s.input} type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                <label style={s.label}>Gender</label>
                <div style={{ display: "flex", gap: 10, marginTop: 6, marginBottom: 4 }}>
                  {["male", "female", "other"].map(g => (
                    <button key={g} onClick={() => setForm(f => ({ ...f, gender: g }))} style={{ ...s.btn(form.gender === g ? T.accent : T.sub, form.gender !== g), flex: 1, justifyContent: "center", padding: "10px 6px", fontSize: 13 }}>{g === "male" ? "♂ Male" : g === "female" ? "♀ Female" : "⚧ Other"}</button>
                  ))}
                </div>
                <label style={s.label}>Age</label>
                <input style={s.input} type="number" placeholder="Age in years" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
              </>
            )}

            {step === 1 && (
              <>
                <label style={s.label}>Height (cm)</label>
                <input style={s.input} type="number" placeholder="e.g. 175" value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))} />
                <label style={s.label}>Weight (kg)</label>
                <input style={s.input} type="number" placeholder="e.g. 75" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
                {bmi && (
                  <div style={{ ...s.card, marginTop: 16, marginBottom: 0, background: bmiCat.color + "11", border: `1px solid ${bmiCat.color}44` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 42, color: bmiCat.color, lineHeight: 1 }}>{bmi}</div>
                        <div style={{ fontSize: 12, color: T.sub, letterSpacing: 2 }}>BMI SCORE</div>
                      </div>
                      <div>
                        <div style={{ ...s.badge(bmiCat.color), fontSize: 14, padding: "4px 12px" }}>{bmiCat.label}</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <label style={s.label}>Primary Goal</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6, marginBottom: 8 }}>
                  {Object.keys(DIET_PLANS).map(g => (
                    <button key={g} onClick={() => setForm(f => ({ ...f, goal: g }))} style={{ ...s.btn(form.goal === g ? T.accent : T.sub, form.goal !== g), justifyContent: "flex-start", fontSize: 14, textTransform: "capitalize" }}>
                      {form.goal === g ? "✓ " : ""}{g === "lose fat" ? "🔥 Lose Fat" : g === "build muscle" ? "💪 Build Muscle" : "⚡ Improve Performance"}
                    </button>
                  ))}
                </div>
                <label style={s.label}>Experience Level</label>
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  {["beginner", "intermediate", "advanced"].map(e => (
                    <button key={e} onClick={() => setForm(f => ({ ...f, experience: e }))} style={{ ...s.btn(form.experience === e ? T.accent2 : T.sub, form.experience !== e), flex: 1, justifyContent: "center", padding: "10px 4px", fontSize: 12, textTransform: "capitalize" }}>{e}</button>
                  ))}
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ ...s.btn(T.sub, true), flex: 1, justifyContent: "center" }}>← Back</button>}
              {step < steps.length - 1
                ? <button onClick={() => setStep(s => s + 1)} style={{ ...s.btn(T.accent, false), flex: 1, justifyContent: "center" }}>Continue →</button>
                : <button onClick={submit} style={{ ...s.btn(T.green, false), flex: 1, justifyContent: "center" }}>🥊 Start Training</button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── HOME SCREEN ──────────────────────────────────────────────────────────────
  const HomeScreen = () => {
    const dayData = WORKOUT_DATA[todayKey];
    const bmi = user?.bmi;
    const bmiCat = bmi ? getBMICategory(bmi) : null;

    return (
      <div style={{ padding: 16 }}>
        {/* Hero greeting */}
        <div style={{ ...s.card, background: `linear-gradient(135deg, ${dayData.color}22, ${T.card})`, border: `1px solid ${dayData.color}44`, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, color: T.sub, letterSpacing: 2 }}>WELCOME BACK,</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: T.text, lineHeight: 1.1 }}>{user?.name?.toUpperCase() || "FIGHTER"}</div>
              <div style={{ marginTop: 8 }}>
                <span style={{ ...s.badge(dayData.color) }}>{dayData.label}</span>
                <span style={{ marginLeft: 6, fontSize: 13, color: T.sub }}>{dayData.theme}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 32, color: T.accent2, lineHeight: 1 }}>{streak}</div>
              <div style={{ fontSize: 10, color: T.sub, letterSpacing: 2 }}>DAY STREAK 🔥</div>
            </div>
          </div>
          {dayData.isRest ? (
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <div style={{ fontSize: 60 }}>😴</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: T.sub, letterSpacing: 3 }}>REST & RECOVER</div>
              <div style={{ fontSize: 14, color: T.sub, marginTop: 4 }}>Champions are built in recovery</div>
            </div>
          ) : (
            <button onClick={() => startWorkout(todayKey)} style={{ ...s.btn(dayData.color, false), width: "100%", justifyContent: "center", marginTop: 16, fontSize: 16, animation: "glow 2s infinite" }}>
              🥊 START TODAY'S WORKOUT
            </button>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            { n: bmi || "--", l: "BMI" },
            { n: user?.weight ? `${user.weight}kg` : "--", l: "Weight" },
            { n: weekNumber, l: "Week" },
            { n: "6/7", l: "Days" },
          ].map((st, i) => (
            <div key={i} style={{ ...s.card, padding: 12, textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 26, color: [T.accent, T.accent2, T.accent3, T.green][i], lineHeight: 1 }}>{st.n}</div>
              <div style={{ fontSize: 10, color: T.sub, letterSpacing: 2, marginTop: 2 }}>{st.l}</div>
            </div>
          ))}
        </div>

        {/* Weekly overview */}
        <div style={s.card}>
          <div style={s.sectionTitle}>THIS WEEK</div>
          <div style={{ display: "flex", gap: 6 }}>
            {DAYS.map((d, i) => {
              const isToday = i === todayIdx;
              const dayD = WORKOUT_DATA[d];
              return (
                <div key={d} onClick={() => startWorkout(d)} style={{ flex: 1, textAlign: "center", cursor: "pointer", padding: "10px 4px", borderRadius: 10, background: isToday ? dayD.color + "33" : T.card2, border: `2px solid ${isToday ? dayD.color : T.border}`, transition: "all 0.2s" }}>
                  <div style={{ fontSize: 18 }}>{dayD.isRest ? "😴" : "🥊"}</div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 13, color: isToday ? dayD.color : T.sub, letterSpacing: 1 }}>{dayNames[i]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's exercises preview */}
        {!dayData.isRest && (
          <div style={s.card}>
            <div style={s.sectionTitle}>TODAY'S PLAN</div>
            {dayData.sections.map((sec, si) => (
              <div key={si} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: T.accent2, marginBottom: 8, textTransform: "uppercase" }}>{sec.name}</div>
                {sec.exercises.map((ex, ei) => (
                  <div key={ei} style={s.exRow(ex.isRest)}>
                    <span style={{ fontSize: 20 }}>{ex.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{ex.name}</div>
                      <div style={{ fontSize: 12, color: T.sub }}>
                        {ex.sets ? `${ex.sets} sets × ` : ""}{ex.reps ? `${ex.reps} reps` : ex.duration ? fmt(ex.duration) : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Quick access */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Recovery", icon: "🧘", screen: "recovery", color: T.green },
            { label: "Diet Plan", icon: "🥗", screen: "diet", color: T.accent2 },
            { label: "Knuckle Work", icon: "🤜", screen: "knuckle", color: T.accent },
            { label: "Goals & PRs", icon: "🎯", screen: "goals", color: T.purple },
          ].map(q => (
            <button key={q.screen} onClick={() => setScreen(q.screen)} style={{ ...s.card, border: `1px solid ${q.color}44`, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: 16, background: q.color + "11" }}>
              <span style={{ fontSize: 28 }}>{q.icon}</span>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: q.color, letterSpacing: 2 }}>{q.label}</div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ── RECOVERY SCREEN ──────────────────────────────────────────────────────────
  const RecoveryScreen = () => (
    <div style={{ padding: 16 }}>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 4, color: T.green, marginBottom: 4 }}>RECOVERY</div>
      <div style={{ fontSize: 13, color: T.sub, marginBottom: 20, letterSpacing: 2 }}>STRETCH & RESTORE</div>

      {RECOVERY_STRETCHES.map((str, i) => (
        <div key={i} style={{ ...s.card, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: T.green + "22", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue'", fontSize: 18, color: T.green, flexShrink: 0 }}>{fmt(str.duration)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Rajdhani'", fontWeight: 700, fontSize: 16 }}>{str.name}</div>
            <div style={{ ...s.badge(T.green), display: "inline-block", marginBottom: 6 }}>{str.muscle}</div>
            <div style={{ fontSize: 14, color: T.sub }}>{str.cue}</div>
          </div>
        </div>
      ))}

      <div style={{ ...s.card, background: T.green + "11", border: `1px solid ${T.green}44` }}>
        <div style={s.sectionTitle}>SUNDAY PROTOCOL</div>
        {["Full Recovery — no training", "8 hours sleep minimum", "Eat nutrient-dense foods", "Hydrate: 3–4L water", "Light mobility work only", "Foam roll sore muscles"].map((tip, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${T.border}22` }}>
            <div style={{ color: T.green, fontSize: 16 }}>✓</div>
            <div style={{ fontSize: 15 }}>{tip}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── DIET SCREEN ──────────────────────────────────────────────────────────────
  const DietScreen = () => {
    const plan = DIET_PLANS[user?.goal || "improve performance"];
    return (
      <div style={{ padding: 16 }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 4, color: T.accent2, marginBottom: 4 }}>DIET PLAN</div>
        <div style={{ fontSize: 13, color: T.sub, marginBottom: 8, letterSpacing: 2 }}>FUEL YOUR PERFORMANCE</div>
        <div style={{ ...s.badge(T.accent2), display: "inline-block", marginBottom: 20, fontSize: 13 }}>Goal: {user?.goal?.toUpperCase() || "PERFORMANCE"} — {plan.calories}</div>

        {plan.meals.map((m, i) => (
          <div key={i} style={{ ...s.card, display: "flex", gap: 14 }}>
            <div style={{ width: 70, flexShrink: 0 }}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: T.accent2, fontWeight: 700 }}>{m.time}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{m.meal}</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: T.sub }}>{m.macros}</div>
            </div>
          </div>
        ))}

        <div style={{ ...s.card }}>
          <div style={s.sectionTitle}>HYDRATION & SUPPLEMENTS</div>
          {["Water: 3–4L daily, extra on training days", "Creatine: 5g daily (post-workout)", "Protein: 1.6–2.2g per kg bodyweight", "Carbs: highest on training days", "Omega-3: 1–2g fish oil daily", "Magnesium: 400mg at night for recovery"].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: `1px solid ${T.border}22`, alignItems: "center" }}>
              <div style={{ color: T.accent2 }}>•</div>
              <div style={{ fontSize: 14 }}>{tip}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── GOALS SCREEN ─────────────────────────────────────────────────────────────
  const GoalsScreen = () => {
    const [newPR, setNewPR] = useState({ exercise: "", value: "" });

    const shortGoals = [
      { goal: "10+ Pull-ups in a row", done: false },
      { goal: "100 Push-ups total in a session", done: false },
      { goal: "20 min Skipping Nonstop", done: false },
      { goal: "8 Rounds Shadowboxing", done: false },
      { goal: "Better Speed, Power & Stamina", done: false },
    ];

    const longGoals = [
      { goal: "Complete 8-Week Program", weeks: "8 weeks" },
      { goal: "Spar 3×3 min rounds", weeks: "12 weeks" },
      { goal: "50 Consecutive Pull-ups", weeks: "6 months" },
      { goal: "500 Push-ups daily", weeks: "6 months" },
      { goal: "30 min Nonstop Skipping", weeks: "6 months" },
      { goal: "Compete in Amateur Event", weeks: "1 year" },
    ];

    const prList = [
      { ex: "Pull-ups", best: prs["pullups"] || "--" },
      { ex: "Push-ups (1 min)", best: prs["pushups"] || "--" },
      { ex: "Burpees (1 min)", best: prs["burpees"] || "--" },
      { ex: "Plank (sec)", best: prs["plank"] || "--" },
    ];

    return (
      <div style={{ padding: 16 }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 4, color: T.purple, marginBottom: 20 }}>GOALS & PRs</div>

        {/* PRs */}
        <div style={s.card}>
          <div style={s.sectionTitle}>PERSONAL RECORDS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {prList.map((pr, i) => (
              <div key={i} style={{ background: T.card2, border: `1px solid ${T.purple}44`, borderRadius: 10, padding: 14, textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 38, color: T.purple, lineHeight: 1 }}>{pr.best}</div>
                <div style={{ fontSize: 11, color: T.sub, letterSpacing: 1 }}>{pr.ex}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <select style={{ ...s.input, flex: 1, marginBottom: 0 }} value={newPR.exercise} onChange={e => setNewPR(p => ({ ...p, exercise: e.target.value }))}>
              <option value="">Select exercise</option>
              {["pullups", "pushups", "burpees", "plank"].map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <input style={{ ...s.input, flex: 1, marginBottom: 0 }} type="number" placeholder="Count" value={newPR.value} onChange={e => setNewPR(p => ({ ...p, value: e.target.value }))} />
            <button onClick={() => { if (newPR.exercise && newPR.value) { setPrs(p => ({ ...p, [newPR.exercise]: newPR.value })); setNewPR({ exercise: "", value: "" }); } }} style={{ ...s.btn(T.purple, false), padding: "10px 14px", whiteSpace: "nowrap" }}>Log PR</button>
          </div>
        </div>

        {/* Short-term */}
        <div style={s.card}>
          <div style={s.sectionTitle}>8-WEEK TARGETS</div>
          {shortGoals.map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${T.border}22`, alignItems: "center" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${g.done ? T.green : T.border}`, background: g.done ? T.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, flexShrink: 0 }}>{g.done ? "✓" : ""}</div>
              <div style={{ fontSize: 15, color: g.done ? T.sub : T.text, textDecoration: g.done ? "line-through" : "none" }}>{g.goal}</div>
            </div>
          ))}
        </div>

        {/* Long-term */}
        <div style={s.card}>
          <div style={s.sectionTitle}>LONG-TERM GOALS</div>
          {longGoals.map((g, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${T.border}22` }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ color: T.accent, fontSize: 16 }}>🎯</div>
                <div style={{ fontSize: 15 }}>{g.goal}</div>
              </div>
              <div style={{ ...s.badge(T.accent3), whiteSpace: "nowrap" }}>{g.weeks}</div>
            </div>
          ))}
        </div>

        {/* Progression Plan */}
        <div style={s.card}>
          <div style={s.sectionTitle}>PROGRESSION PLAN</div>
          {[
            { weeks: "Weeks 1–2", focus: "Learn form, build consistency" },
            { weeks: "Weeks 3–4", focus: "Increase reps, speed & rounds" },
            { weeks: "Weeks 5–6", focus: "Add defense, counters, more intensity" },
            { weeks: "Weeks 7–8", focus: "Improve power, timing, endurance" },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: `1px solid ${T.border}22`, alignItems: "center" }}>
              <div style={{ ...s.badge(i === weekNumber - 1 ? T.accent : T.sub), whiteSpace: "nowrap" }}>{p.weeks}</div>
              <div style={{ fontSize: 15, color: i === weekNumber - 1 ? T.text : T.sub }}>{p.focus}</div>
              {i === weekNumber - 1 && <div style={{ color: T.accent, fontSize: 16 }}>◀ NOW</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── KNUCKLE SCREEN ───────────────────────────────────────────────────────────
  const KnuckleScreen = () => {
    const [activeEx, setActiveEx] = useState(null);
    const [knuckleSets, setKnuckleSets] = useState({});
    const [neckSets, setNeckSets] = useState({});
    const knuckleTimerRef = useRef(null);

    useEffect(() => {
      if (activeEx?.running && activeEx?.timer > 0) {
        knuckleTimerRef.current = setInterval(() => {
          setActiveEx(a => a ? { ...a, timer: a.timer - 1 } : null);
        }, 1000);
      } else if (activeEx?.timer === 0 && activeEx?.running) {
        setActiveEx(a => a ? { ...a, running: false } : null);
      }
      return () => clearInterval(knuckleTimerRef.current);
    }, [activeEx?.running, activeEx?.timer]);

    const logSet = (type, id) => {
      if (type === 'knuckle') setKnuckleSets(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
      else setNeckSets(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
    };

    const ExRow = ({ ex, type, idx }) => {
      const isActive = activeEx?.type === type && activeEx?.idx === idx;
      const setsLog = type === 'knuckle' ? knuckleSets : neckSets;
      const doneSets = setsLog[ex.id] || 0;
      const totalSets = ex.sets || 1;
      const complete = doneSets >= totalSets;
      const accentColor = type === 'neck' ? T.accent2 : T.accent;

      return (
        <div style={{ ...s.card, marginBottom: 10, border: `1px solid ${complete ? T.green : isActive ? accentColor : T.border}44`, background: complete ? T.green + "0a" : T.card }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{ex.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: 2, color: complete ? T.green : T.text }}>{ex.name}</div>
                {complete && <span style={{ ...s.badge(T.green), fontSize: 10 }}>✓ DONE</span>}
              </div>
              <div style={{ fontSize: 13, color: T.sub, lineHeight: 1.5, marginBottom: 8 }}>{ex.cue}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {ex.sets && <span style={{ ...s.badge(accentColor) }}>{ex.sets} sets</span>}
                {ex.reps && <span style={{ ...s.badge(T.accent3) }}>× {ex.reps} reps</span>}
                {ex.duration && <span style={{ ...s.badge(T.accent3) }}>⏱ {fmt(ex.duration)}</span>}
                {doneSets > 0 && !complete && <span style={{ ...s.badge(T.accent) }}>{doneSets}/{totalSets} sets done</span>}
              </div>
            </div>
          </div>

          {isActive && ex.unit === "time" && (
            <div style={{ background: dark ? "#0a0a18" : "#eef0ff", borderRadius: 10, padding: 12, marginBottom: 10, textAlign: "center" }}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 48, color: activeEx.timer < 5 ? T.accent : T.text, lineHeight: 1, animation: activeEx.running && activeEx.timer <= 5 ? "countPulse 0.5s infinite" : "none" }}>{fmt(activeEx.timer)}</div>
              <div style={{ fontSize: 11, color: T.sub, letterSpacing: 3, marginTop: 2 }}>SET {activeEx.set} OF {totalSets}</div>
              <div style={{ height: 4, background: T.border, borderRadius: 2, marginTop: 8 }}>
                <div style={{ height: "100%", width: `${((ex.duration - activeEx.timer) / ex.duration) * 100}%`, background: `linear-gradient(90deg,${accentColor},${T.accent2})`, borderRadius: 2, transition: "width 1s linear" }} />
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ex.unit === "time" ? (
              !isActive ? (
                <button onClick={() => setActiveEx({ type, idx, set: 1, timer: ex.duration, running: false })} style={{ ...s.btn(accentColor, false), fontSize: 13, padding: "8px 16px" }}>▶ Start Timer</button>
              ) : (
                <>
                  <button onClick={() => {
                    if (activeEx.timer === 0) setActiveEx(a => ({ ...a, timer: ex.duration, running: false }));
                    else setActiveEx(a => ({ ...a, running: !a.running }));
                  }} style={{ ...s.btn(activeEx.running ? T.accent2 : T.green, false), fontSize: 13, padding: "8px 14px" }}>
                    {activeEx.timer === 0 ? "↺ Redo" : activeEx.running ? "⏸ Pause" : "▶ Start"}
                  </button>
                  {(activeEx.timer === 0 || !activeEx.running) && (
                    <button onClick={() => {
                      logSet(type, ex.id);
                      if ((doneSets + 1) >= totalSets) setActiveEx(null);
                      else setActiveEx(a => ({ ...a, set: a.set + 1, timer: ex.duration, running: false }));
                    }} style={{ ...s.btn(T.green, false), fontSize: 13, padding: "8px 14px" }}>
                      {doneSets + 1 >= totalSets ? "✓ Complete" : "Next Set →"}
                    </button>
                  )}
                  <button onClick={() => setActiveEx(null)} style={{ ...s.btn(T.sub, true), fontSize: 13, padding: "8px 10px" }}>✕</button>
                </>
              )
            ) : (
              <button onClick={() => logSet(type, ex.id)} disabled={complete} style={{ ...s.btn(complete ? T.sub : T.green, complete), fontSize: 13, padding: "8px 16px", opacity: complete ? 0.5 : 1 }}>
                {complete ? "✓ All Sets Done" : `+ Log Set (${doneSets + 1}/${totalSets})`}
              </button>
            )}
          </div>
        </div>
      );
    };

    return (
      <div style={{ padding: 16 }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 4, color: T.accent, marginBottom: 4 }}>KNUCKLE</div>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: 3, color: T.sub, marginBottom: 16 }}>CONDITIONING</div>

        <div style={{ ...s.card, background: T.accent + "11", border: `1px solid ${T.accent}44`, marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: T.sub, lineHeight: 1.7 }}>
            <strong style={{ color: T.accent }}>⚠️ Important:</strong> Knuckle conditioning must be progressive. Never skip stages. Allow 48h recovery between sessions. Pain ≠ gain here — discomfort is okay, sharp pain is not.
          </div>
        </div>

        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 3, color: T.accent, marginBottom: 10 }}>CONDITIONING DRILLS</div>
        {KNUCKLE_CONDITIONING.map((k, i) => {
          const isUnlocked = i < weekNumber / 2;
          const ex = { id: `knuckle_${i}`, name: k.drill, sets: 3, duration: k.duration || undefined, reps: k.reps || undefined, unit: k.duration ? "time" : undefined, icon: "🤜", cue: k.desc };
          return (
            <div key={i}>
              {!isUnlocked && <div style={{ ...s.badge(T.sub), display: "inline-block", marginBottom: 6, fontSize: 11 }}>🔒 UNLOCKS WEEK {k.week}</div>}
              <div style={{ opacity: isUnlocked ? 1 : 0.45, pointerEvents: isUnlocked ? "auto" : "none" }}>
                <ExRow ex={ex} type="knuckle" idx={i} />
              </div>
            </div>
          );
        })}

        {/* ── NECK WORKOUT ── */}
        <div style={{ marginTop: 8, marginBottom: 4 }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 32, letterSpacing: 4, color: T.accent2, lineHeight: 1 }}>NECK</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 3, color: T.sub, marginBottom: 12 }}>WORKOUT</div>
        </div>
        <div style={{ ...s.card, background: T.accent2 + "11", border: `1px solid ${T.accent2}44`, marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: T.sub, lineHeight: 1.7 }}>
            <strong style={{ color: T.accent2 }}>🏋️ Why train your neck?</strong> A strong neck absorbs punch impact, dramatically reducing knockdown risk. Train 2–3× per week. Start light — the neck is not used to direct loading. Stop immediately if you feel nerve or sharp pain.
          </div>
        </div>
        {NECK_WORKOUT.map((ex, i) => (
          <ExRow key={ex.id} ex={ex} type="neck" idx={i} />
        ))}

        <div style={s.card}>
          <div style={s.sectionTitle}>HAND CARE PROTOCOL</div>
          {["Always use hand wraps during bag work", "Apply arnica gel post-training", "Soak hands in warm epsom salt water 10 min", "Moisturize knuckles daily to prevent cracking", "If knuckles are red/swollen — rest 48h", "Never punch hard surfaces without wraps"].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: `1px solid ${T.border}22`, alignItems: "center" }}>
              <div style={{ color: T.accent, fontSize: 14 }}>•</div>
              <div style={{ fontSize: 14 }}>{tip}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── PROGRESS SCREEN ──────────────────────────────────────────────────────────
  const ProgressScreen = () => (
    <div style={{ padding: 16 }}>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 4, color: T.accent3, marginBottom: 20 }}>PROGRESS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { n: streak, l: "Day Streak", color: T.accent },
          { n: weekNumber, l: "Current Week", color: T.accent2 },
          { n: "42", l: "Total Workouts", color: T.green },
          { n: user?.bmi || "--", l: "BMI", color: T.accent3 },
        ].map((st, i) => (
          <div key={i} style={{ ...s.card, textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 52, color: st.color, lineHeight: 1 }}>{st.n}</div>
            <div style={{ fontSize: 11, color: T.sub, letterSpacing: 2 }}>{st.l}</div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={s.sectionTitle}>WEEKLY ACTIVITY</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 100, marginTop: 10 }}>
          {[90, 100, 75, 60, 95, 85, 0].map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                <div style={{ width: "100%", height: `${v}%`, background: i === todayIdx ? T.accent : T.accent + "44", borderRadius: "4px 4px 0 0", transition: "height 0.5s" }} />
              </div>
              <div style={{ fontSize: 10, color: i === todayIdx ? T.accent : T.sub }}>{dayNames[i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <div style={s.sectionTitle}>BOXING COMBOS MASTERED</div>
        {[
          { combo: "Jab → Cross", mastery: 85 },
          { combo: "Jab → Cross → Hook", mastery: 70 },
          { combo: "Double Jab → Cross", mastery: 60 },
          { combo: "Jab → Cross → Hook → Cross", mastery: 45 },
          { combo: "Slip → Cross → Hook", mastery: 30 },
        ].map((c, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{c.combo}</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: T.accent }}>{c.mastery}%</div>
            </div>
            <div style={{ height: 6, background: T.border, borderRadius: 3 }}>
              <div style={{ height: "100%", width: `${c.mastery}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.accent2})`, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── RENDER ─────────────────────────────────────────────────────────────────
  if (screen === "register") return (
    <>
      <style>{css}</style>
      <div style={s.app}><RegisterScreen /></div>
    </>
  );

  if (screen === "active") return (
    <>
      <style>{css}</style>
      <div style={s.app}><ActiveTimer /></div>
    </>
  );

  const navItems = [
    { label: "🏠 Home", key: "home" },
    { label: "🧘 Recovery", key: "recovery" },
    { label: "🥗 Diet", key: "diet" },
    { label: "🤜 Knuckle", key: "knuckle" },
    { label: "🎯 Goals", key: "goals" },
    { label: "📊 Progress", key: "progress" },
  ];

  return (
    <>
      <style>{css}</style>
      <div style={s.app}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <div style={s.logo}>IRON FIST 🥊</div>
            <div style={s.logoSub}>Boxing & Fitness</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setDark(d => !d)} style={s.toggle}>
              {dark ? "☀️" : "🌙"}
            </button>
            {user && (
              <button onClick={logoutUser} title="Sign out" style={{ ...s.toggle, fontSize: 14, padding: "6px 12px", color: T.sub }}>
                {user.googleAvatar
                  ? <img src={user.googleAvatar} alt="avatar" style={{ width: 22, height: 22, borderRadius: "50%", verticalAlign: "middle" }} />
                  : "👤"} Sign out
              </button>
            )}
          </div>
        </div>

        {/* Nav */}
        <div style={s.nav}>
          {navItems.map(n => (
            <button key={n.key} onClick={() => setScreen(n.key)} style={s.navBtn(screen === n.key)}>{n.label}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 120px)" }}>
          {screen === "home" && <HomeScreen />}
          {screen === "recovery" && <RecoveryScreen />}
          {screen === "diet" && <DietScreen />}
          {screen === "knuckle" && <KnuckleScreen />}
          {screen === "goals" && <GoalsScreen />}
          {screen === "progress" && <ProgressScreen />}
        </div>
      </div>
    </>
  );
}