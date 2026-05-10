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

const HORSE_STANCE_LEVELS = [
  {
    level: 1, name: "Foundation Stance", chineseName: "Mǎ Bù — 馬步", duration: 30,
    targetWeeks: "1–2", icon: "🟢",
    cue: "Feet 2× shoulder-width. Toes forward or very slight outward. Squat until thighs are at 45°. Hands on hips or in fists at waist. Spine neutral, chest up. This is where you build awareness.",
    standard: "Hold 30 seconds without rising or tipping. Breathing must stay steady throughout.",
    mistakes: ["Knees caving inward", "Heels lifting off floor", "Leaning forward with torso"],
  },
  {
    level: 2, name: "Parallel Thigh Hold", chineseName: "Mǎ Bù — 馬步", duration: 60,
    targetWeeks: "3–4", icon: "🟡",
    cue: "Same wide stance. Now lower until thighs are parallel to the ground. Fists at waist (chambered), elbows back. This is real Horse Stance — the foundation of all Shaolin power.",
    standard: "Hold 60 seconds, thighs fully parallel, no movement, no shaking.",
    mistakes: ["Butt sticking out (butt wink)", "Shoulders rounding forward", "Breathing too fast — slow nasal breath only"],
  },
  {
    level: 3, name: "Iron Stance Endurance", chineseName: "Tiě Mǎ Bù — 鐵馬步", duration: 120,
    targetWeeks: "5–7", icon: "🟠",
    cue: "Same as Level 2 but held for 2 minutes. Arms can extend forward (shoulder height, fists closed) for added difficulty. Every second past failure is where real strength builds. Breathe through your nose, exhale slowly.",
    standard: "2 continuous minutes, thighs parallel, arms extended or at waist.",
    mistakes: ["Raising even slightly when it hurts — resist this urge", "Looking down — eyes forward", "Jaw clenching — relax the face, tension goes to the legs"],
  },
  {
    level: 4, name: "Shaolin Warrior Hold", chineseName: "Shàolín Mǎ Bù — 少林馬步", duration: 300,
    targetWeeks: "8–12", icon: "🔴",
    cue: "5-minute hold. Stance width increases slightly. Arms extended forward at shoulder height for full duration. Shaolin monks consider this the minimum test of lower body iron strength. Your legs will burn — that is the point. Do not move.",
    standard: "5 minutes, parallel thighs, arms forward at shoulder height, motionless.",
    mistakes: ["Stopping at the first burn — this is where beginners quit and warriors stay", "Adjusting foot position mid-hold", "Breathing with mouth"],
  },
  {
    level: 5, name: "Shaolin Entry Standard", chineseName: "Rù Mén Biāozhǔn — 入門標準", duration: 600,
    targetWeeks: "12–20+", icon: "⚫",
    cue: "10-minute continuous hold. Thighs parallel, arms extended, eyes fixed forward, nasal breathing only. This is the Shaolin temple entry-level standard — the minimum a prospective monk must demonstrate. Very few people in the world can hold this. Train daily to reach it.",
    standard: "10 full minutes, zero movement, thighs parallel, full upper body stillness. This is the gate.",
    mistakes: ["Skipping levels — you must earn each one", "Training with pain (joint pain ≠ muscle burn)", "Attempting this without months of consistent lower-level training"],
  },
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

// ── PERFECT FORM GUIDES ──────────────────────────────────────────────────────
const FORM_GUIDES = {
  "Skipping Rope": { steps: ["Stand tall, elbows tucked close to ribs, wrists doing the rotation — not your arms.", "Land softly on the balls of your feet, never flat-footed — this protects your joints.", "Keep your chin down and eyes forward, mimicking your boxing guard.", "Jump just high enough for the rope to pass — 1-2 cm off the ground is perfect.", "Breathe rhythmically: inhale 2 jumps, exhale 2 jumps."], mistakes: ["Jumping too high wastes energy — keep it compact.", "Big arm swings slow you down — it's all in the wrists.", "Looking down breaks your posture and balance."] },
  "Arm Circles": { steps: ["Stand feet shoulder-width apart, arms out straight to your sides at shoulder height.", "Make small circles forward (15 reps), gradually increase to large circles.", "Reverse direction — small to large — another 15 reps.", "Keep your core tight and don't shrug your shoulders up toward your ears.", "Feel the deltoid burn — that's the rotator cuff warming up."], mistakes: ["Don't hunch — keep chest open and proud.", "Avoid rushing — slow controlled circles recruit more muscle fibers."] },
  "Hip Rotations": { steps: ["Feet wider than shoulder-width, hands on hips.", "Draw large clockwise circles with your hips — 10 rotations.", "Reverse to counterclockwise — 10 rotations.", "Keep your upper body relatively still; the movement is all in the hips.", "Progressively widen the circle as you loosen up."], mistakes: ["Don't lean the whole torso — isolate the hip joint.", "Avoid locking your knees — keep a soft bend."] },
  "Light Shadowboxing": { steps: ["Start in your boxing stance: left foot forward (orthodox), feet shoulder-width, weight on balls of feet.", "Keep hands up at chin level, chin tucked, eyes on imaginary opponent.", "Throw slow, deliberate jabs focusing on full extension and hand speed on the retraction.", "Move your feet between combinations — circle, step in, step out.", "Breathe out sharply on each punch, stay loose between shots."], mistakes: ["Don't tense up between punches — tension kills speed.", "Avoid flat-footed stance — you need to be mobile at all times.", "Don't drop your guard hand when throwing the other."] },
  "Stance Movement": { steps: ["Orthodox stance: left foot 12-18 inches ahead of right, feet shoulder-width apart.", "Weight distributed 60/40 (front/rear) — never equal or you can't move fast.", "To move forward: push off the rear foot, lead foot moves first.", "To move back: push off the lead foot, rear foot moves first.", "To move left: left foot steps, right foot follows (same distance). Never cross your feet."], mistakes: ["Crossing feet destroys your balance and makes you easy to knock down.", "Standing flat-footed kills your reaction time.", "Bouncing straight up uses energy — stay low and glide."] },
  "Pull-ups": { steps: ["Dead hang from the bar, hands slightly wider than shoulder-width, palms facing away.", "Retract your scapula (shoulder blades together and down) BEFORE pulling — this protects your shoulder.", "Drive your elbows toward your hips, not your armpits.", "Pull until your chin clears the bar — chest-to-bar is even better.", "Lower under full control — a 3-second descent builds 40% more strength."], mistakes: ["Kipping (swinging) cheats the muscle — use it only for sport, not strength.", "Not going to full dead hang — shortened ROM = weaker development.", "Shrugging shoulders up — always depress the scapula first."] },
  "Push-ups": { steps: ["Hands slightly wider than shoulder-width, fingers spread, index fingers pointing forward.", "Lower your body until your chest touches (or nearly touches) the floor — full ROM.", "Elbows travel at 45° angle to your body — not flared out, not pinned in.", "At the top, fully extend the elbows and protract the shoulder blades (push the floor away).", "Keep your core rigid — body is one straight line from head to heels."], mistakes: ["Sagging hips — means weak core, fix by squeezing glutes.", "Flared elbows — heavy rotator cuff stress; bring them in to 45°.", "Partial range of motion — you only get strong through what you train."] },
  "Squats": { steps: ["Feet slightly wider than shoulder-width, toes angled 15-30° outward.", "Initiate the movement by pushing your knees OUT (in the direction of your toes) and sitting BACK.", "Descend until your hip crease is below your knee (parallel or below).", "Keep your chest up, lumbar curve maintained — don't round your lower back.", "Drive through your full foot to stand — don't just push through the heels."], mistakes: ["Knees caving inward (valgus) is a red flag — strengthen your glutes.", "Heels rising — indicates tight calves or ankles; work on mobility.", "Excessive forward lean — weak upper back or ankles."] },
  "Walking Lunges": { steps: ["Start standing tall, core engaged.", "Step forward with one foot, landing with your heel first.", "Lower your rear knee until it hovers 1 inch above the floor.", "Your front shin should be vertical — knee behind the toes.", "Push off the front foot and bring the rear foot forward to begin the next lunge."], mistakes: ["Front knee shooting past the toes — increases knee joint pressure.", "Leaning the torso forward — keep it upright for glute activation.", "Short stride — go big to maximize hip flexor stretch and glute activation."] },
  "Plank": { steps: ["Forearms on floor, elbows directly under shoulders, hands flat or fisted.", "Body forms one straight line from head to heels — no piking, no sagging.", "Squeeze your glutes, quads, and abs simultaneously.", "Push the floor away with your elbows (protract the scapula) — don't collapse.", "Breathe steadily — don't hold your breath."], mistakes: ["Hips too high (piking) — it's easier but doesn't train the core properly.", "Hips sagging — immediately re-engage your core and glutes.", "Holding breath — this spikes blood pressure; always breathe."] },
  "Jab Only": { steps: ["From your stance, extend your lead hand (left for orthodox) toward the target at chin height.", "Rotate your fist to horizontal at full extension — palm faces down.", "Your lead shoulder should rise slightly to protect your chin at extension.", "Snap the punch back along the same path even faster than you extended it.", "Your rear hand stays at your chin the entire time."], mistakes: ["Dropping the rear hand — leaves you open to counters.", "Telegraphing by drawing the arm back before punching.", "No snap on retraction — a slow return is a slow guard."] },
  "Jab + Cross": { steps: ["Throw the jab first — full extension, snap back.", "Immediately as the jab retracts, rotate your rear hip forward and drive the cross.", "Your rear heel pivots off the ground as your hip rotates — this is where the power comes from.", "The cross travels in a straight line at face height, rotating the fist to horizontal on impact.", "Both punches are thrown in one fluid rhythm — 1-2 — not two separate events."], mistakes: ["No hip rotation on the cross — makes it an arm punch with no power.", "Dropping the lead hand after the jab — makes it easy to counter.", "Leaning forward and losing balance — stay centered over your feet."] },
  "Burpees": { steps: ["Start standing, then drop your hands to the floor (squat thrust position).", "Jump both feet back simultaneously into a push-up position.", "Lower your chest to the floor — full push-up.", "Push up explosively and jump your feet forward to squat position.", "Explode upward into a jump, arms overhead, and land softly."], mistakes: ["Skipping the push-up at the bottom — defeats the purpose of the exercise.", "Landing with stiff knees — absorb with your joints or you'll get injured over time.", "Slow transitions — the power of a burpee is in the explosive speed."] },
  "Mountain Climbers": { steps: ["Start in a high push-up position, arms straight, hands under shoulders.", "Bring your right knee toward your chest while keeping your hips level.", "Drive it back and immediately bring the left knee in — alternate rapidly.", "Keep your core braced and hips from rising or dropping.", "The faster and more explosive, the better the conditioning effect."], mistakes: ["Hips too high — turns it into a stretching exercise, not conditioning.", "Bouncing hips side to side — means your core isn't engaged.", "Looking down — keep your neck neutral."] },
  "Jump Squats": { steps: ["Start in a squat position, feet shoulder-width, descend to parallel.", "Explode upward as powerfully as possible, extending fully through hips, knees, and ankles.", "Reach maximum height, then absorb the landing by bending your knees.", "Land with your whole foot, not just the toes or heels.", "Immediately descend into the next squat — don't pause."], mistakes: ["Landing with stiff knees — high injury risk, always absorb.", "Not fully extending at the top — cuts off the power chain.", "Shallow depth — break parallel for maximum glute and quad activation."] },
  "High Knees": { steps: ["Run in place, driving each knee up to hip height or higher.", "Pump opposite arm with each knee drive — right knee, left arm.", "Land on the ball of each foot, not your heel.", "Keep your torso upright — don't lean back or hunch.", "Drive the pace — this should feel like a sprint, not a jog."], mistakes: ["Slow pace — high knees should be explosive to build cardio.", "Arms not pumping — they control your rhythm and speed.", "Looking down — maintain neutral head position."] },
  "Forward Swing": { steps: ["Stand with feet shoulder-width apart, holding the Karlakattai with both hands.", "Swing the Karlakattai forward and upward in front of you, arms straight.", "The apex of the swing should be at or above head height.", "Control the return swing back down between your legs.", "Maintain an upright posture — resist the urge to hunch."], mistakes: ["Losing control at the top — start with slow, controlled swings.", "Bending the elbows excessively — keep arms relatively straight for shoulder work.", "Rounding the lower back on the forward swing — brace your core."] },
  "Backward Swing": { steps: ["Same starting position as forward swing.", "Swing the Karlakattai backward between and behind your legs.", "Allow a slight hip hinge as the weight travels behind you.", "Control the forward return swing.", "Keep the movement smooth and rhythmic — it's a flow, not a jerk."], mistakes: ["Swinging too fast before warming up — risk of shoulder impingement.", "Not controlling the back swing — let momentum work WITH you, not against you."] },
  "Circular Rotation": { steps: ["Hold the Karlakattai with both hands in front of you.", "Swing it in a large circular arc — over your head and around to one side.", "Alternate direction each set for balanced shoulder development.", "Keep your core tight and feet planted to resist the rotational force.", "The movement should be continuous and fluid."], mistakes: ["Stopping between rotations — it's a continuous flow.", "Leaning to the side excessively — keep your spine neutral."] },
  "Neck Flexion": { steps: ["Sit or stand with perfect posture.", "Slowly tuck your chin toward your chest, feeling the stretch through the back of your neck.", "Hold for 1-2 seconds at the bottom.", "Return to neutral slowly — take 2-3 seconds.", "For resistance: press your palm lightly against your forehead and resist with your neck muscles."], mistakes: ["Going too fast — the neck is delicate, slow is always safer.", "Using pain as a guide — discomfort is fine, sharp or nerve pain is not."] },
  "Neck Extension": { steps: ["Sit or stand tall, shoulders down and relaxed.", "Slowly tilt your head back, bringing your chin toward the ceiling.", "Hold for 1-2 seconds at the end range.", "Return to neutral at the same slow speed.", "For resistance: place hands behind your head and resist the backward movement."], mistakes: ["Forcing range of motion — let it come naturally over weeks.", "Compressing the cervical spine by going too far back."] },
  "Isometric Hold": { steps: ["For front: press palm against forehead, resist with neck (don't move — true isometric).", "For back: clasp hands behind your head and resist.", "For sides: press palm against your temple on each side.", "Hold each direction for the full duration.", "Breathe steadily throughout — don't hold your breath during the resistance."], mistakes: ["Allowing the head to move — the point is zero movement against maximum force.", "Not doing all 4 directions — balance prevents injury."] },
  "Wrestler's Bridge": { steps: ["Lie on your back on a mat with knees bent, feet flat on the floor.", "Push your hips up as in a glute bridge, then transfer weight to the top of your head.", "Gradually straighten your legs so only your feet and head are on the mat.", "Hold the arched position, breathing steadily.", "Start with 10 seconds and build up week by week."], mistakes: ["Rushing into it — this is an advanced exercise; build neck strength first.", "No mat under your head — always protect the cervical spine.", "Forcing duration — stop if you feel any nerve pain or dizziness."] },
  "Knuckle Push-ups": { steps: ["Form two fists and place them on the ground, knuckles of the first two fingers down.", "Align your fists under your shoulders, slightly narrower than regular push-ups.", "Keep your wrists straight — do not allow them to bend sideways.", "Perform a standard push-up from this position.", "Build up reps gradually — start with a soft surface (folded towel) then progress to harder surfaces."], mistakes: ["Wrists bending sideways — causes wrist injury; keep them rigid.", "Starting on hard concrete — always progress through surfaces gradually.", "Rushing the exercise — tendon adaptation takes weeks."] },
  "Brick Punches": { steps: ["Start with the lightest contact — just touching the brick surface.", "Use proper hand wrapping before any session.", "Strike with the first two knuckles (index and middle) — not all four.", "Rotate your fist on contact for a tight, compact impact point.", "Start with 10 light strikes per hand and increase only after zero soreness."], mistakes: ["No wraps — non-negotiable; always wrap.", "Striking with all four knuckles — damages the smaller bones.", "Going too hard too fast — progressive overload applies to bones too."] },
  "Rice Bucket Strikes": { steps: ["Fill a bucket with uncooked rice, submerge both hands.", "Open and close your hands slowly, feeling resistance through the rice.", "Perform wrist circles, finger extensions, and grip squeezes.", "Progress to striking into the rice with fists.", "Finish by massaging your hands in the rice."], mistakes: ["Using wet or cooked rice — it needs resistance, not softness.", "Skipping the finger extension movements — tendons need full range of motion training."] },
  "Stretching": { steps: ["Perform each stretch in a slow, controlled manner — no bouncing.", "Hold each position for a minimum of 30 seconds to reach the muscle's true flexibility.", "Breathe into the stretch — exhale to deepen the position.", "Work major muscle groups: quads, hamstrings, hip flexors, chest, shoulders, lats.", "Finish with spinal rotations and neck rolls."], mistakes: ["Bouncing (ballistic stretching) — causes micro-tears in the muscle.", "Stretching cold muscles — always warm up first.", "Holding your breath — it increases muscle tension and reduces flexibility."] },
  "Deep Breathing": { steps: ["Sit or lie comfortably with your spine tall.", "Inhale through your nose for 4 counts, expanding your belly first, then chest.", "Hold for 4 counts.", "Exhale through your mouth for 4 counts, belly falls first.", "Hold empty for 4 counts. This is box breathing — used by elite athletes and special forces."], mistakes: ["Chest breathing only — belly breathing activates the parasympathetic nervous system (recovery mode).", "Rushing the counts — slower is better.", "Doing it half-heartedly — full focus on breath controls heart rate and stress."] },
  "Dead Hang": { steps: ["Grip the bar slightly wider than shoulder-width, thumbs wrapped around.", "Release all tension and let your body hang completely — spine decompresses.", "Engage only the shoulder blades (pull them down and together slightly) to protect the shoulder joint.", "Breathe normally and relax everything below the shoulders.", "Build up gradually — start with 10-second hangs."], mistakes: ["Totally passive hang with shoulders up by ears — causes impingement over time.", "Holding breath — relax and breathe.", "Letting go suddenly — always lower to the ground with control."] },
  "Shadowboxing Speed": { steps: ["Start at 70% speed to establish rhythm and footwork.", "Build to 100% speed in 30-second explosive bursts.", "Between bursts, move your feet and recover — don't stop.", "Focus on combination endings — always finish on a combination, never a single punch.", "Film yourself if possible — shadowboxing reveals technical flaws."], mistakes: ["Brawling mindlessly — every second should have tactical intent.", "Forgetting defense — integrate slips, rolls, and blocks into combinations.", "Standing still — constant movement is the point."] },
  "Jogging": { steps: ["Land midfoot, not heel-first — heel striking at slow pace causes shin splints.", "Keep your arms at 90°, swinging forward and back, not across your body.", "Head up, eyes forward, shoulders relaxed and not hunched.", "Breathe in a rhythm — 2 steps inhale, 2 steps exhale, or adjust to your pace.", "Control your pace — conversational speed means you can speak in short sentences."], mistakes: ["Heel striking — leads to knee and shin pain over time.", "Crossing arms across the body — wastes energy and twists the torso.", "Overstriding — your foot should land under your center of mass, not in front."] },
  "Clap Push-ups": { steps: ["Start in standard push-up position.", "Lower under full control.", "Push explosively with maximum force — aim to get both hands off the ground.", "Clap once while airborne, then catch yourself and absorb landing with bent elbows.", "Do NOT land with stiff arms — you WILL hurt your wrists."], mistakes: ["Incomplete push at the bottom — you need full power from the floor.", "Stiff-arm landing — always absorb with bent elbows.", "Shallow descent — go to the floor for full power development."] },
  "Jump Lunges": { steps: ["Start in a lunge position with both knees at 90°.", "Explode upward and switch legs mid-air.", "Land in the opposite lunge position and absorb with your joints.", "Both knees should return to 90° on landing.", "Keep your torso upright and arms pumping for balance."], mistakes: ["Landing with your knee crashing to the floor — always decelerate.", "Short jump — try to switch feet fully, not just shuffle.", "Leaning forward excessively — keep torso vertical."] },
  "Pike Push-ups": { steps: ["Start in a downward dog position — hips high, body forming an inverted V.", "Keep your legs straight and hands shoulder-width apart.", "Lower the top of your head toward the floor between your hands.", "Push back up to the inverted V by pressing through your palms.", "The motion mimics a shoulder press — this is your bodyweight overhead press."], mistakes: ["Letting the hips drop during the movement — maintain the pike position.", "Flared elbows — keep them tracking over your wrists.", "Not going low enough — touch the floor for full range."] },
  "Leg Raises": { steps: ["Lie flat on your back, hands under your lower back or palms flat beside your hips.", "Keeping your legs straight, raise them to 90° (perpendicular to the floor).", "Lower them slowly back toward the floor — STOP 2-3 inches above the floor.", "Hold that position for 1 second, then raise again.", "The key: your lower back must stay flat on the floor throughout."], mistakes: ["Letting the lower back arch off the floor — this transfers stress from abs to spine.", "Bending the knees — makes it easier but reduces ab activation.", "Dropping the legs to the floor — the eccentric (lowering) phase is where the gains are."] },
  "Russian Twists": { steps: ["Sit with knees bent, feet elevated off the floor (harder) or flat (easier).", "Lean back to about 45° — you should feel your abs engage immediately.", "Clasp your hands together and rotate your torso fully left, then fully right.", "Each full rotation (left + right) counts as one rep.", "Add weight (plate, dumbbell) when bodyweight becomes easy."], mistakes: ["Moving just the arms — the rotation must come from the torso/obliques.", "Not going to full range — rotate until your hands almost touch the floor.", "Rounded spine — keep your chest proud, spine neutral."] },
  "Bicycle Crunches": { steps: ["Lie on your back, hands lightly behind your head (don't pull your neck).", "Bring your right elbow toward your left knee as you extend your right leg.", "Immediately switch — left elbow to right knee, right leg extends.", "The movement is continuous, like pedaling a bike.", "Focus on rotating your torso — the shoulder, not just the elbow, should come toward the knee."], mistakes: ["Pulling the neck forward with your hands — this is neck strain, not ab work.", "Moving only the elbows — the whole upper torso must rotate.", "Too fast — slow and controlled is far more effective than rapid sloppy reps."] },
  "Wide Grip Pull-ups": { steps: ["Grip the bar wider than shoulder-width — roughly 1.5× shoulder width.", "Begin from a full dead hang with shoulder blades depressed.", "Lead with your chest toward the bar — imagine your chest is trying to touch the bar.", "Elbows drive down and back, not just back.", "At the top, your chest should be near bar height — chin is secondary."], mistakes: ["Too-wide grip reduces range of motion and increases shoulder injury risk.", "Not depressing the scapula at the start — you lose stability.", "Swinging — remove momentum and make every rep strict."] },
  "Chin-ups": { steps: ["Supinated grip (palms facing you), hands shoulder-width or slightly inside.", "Dead hang start, then curl your elbows toward your hips.", "Imagine curling a barbell with your entire bodyweight.", "Pull until your chin is above the bar — many go chest to bar for max development.", "Lower slowly under control — 3 seconds down."], mistakes: ["Grip too wide — chin-ups are most effective at shoulder width or slightly inside.", "Half reps — go all the way up and all the way down.", "Elbows flaring out — keep them tracking inward for maximum bicep engagement."] },
  "Forward/Backward Movement": { steps: ["In your boxing stance, push off the rear foot to move forward (lead foot moves first).", "Push off the lead foot to move backward (rear foot moves first).", "Steps should be small and quick — never more than shoulder-width of movement per step.", "Always maintain your stance width — feet return to shoulder-width after each step.", "Practice with a rhythm: push-step, push-step."], mistakes: ["Crossing your feet — eliminates your ability to generate punching power.", "Standing straight up when moving — stay in your athletic stance.", "Taking huge steps — slow and off-balance; keep steps small and controlled."] },
  "Side Movement": { steps: ["To move left: step your left foot out, then bring your right foot to resume shoulder-width stance.", "To move right: step your right foot out, then bring your left foot.", "Never cross your feet — always shuffle, never step-cross.", "Stay bouncy on the balls of your feet throughout.", "Practice combining with punches: step left, then jab-cross."], mistakes: ["Crossing the feet — a knockdown waiting to happen.", "Moving flat-footed — you can't change direction fast without being on the balls of your feet.", "Too large a step — small, controlled shuffles allow immediate follow-up movement."] },
  "Pivot Turns": { steps: ["From your boxing stance, plant your lead foot as the pivot point.", "Push off your rear foot and rotate your body clockwise (to the outside of your opponent).", "Your rear foot sweeps around in an arc while the lead foot stays planted.", "End up in your boxing stance but now at a different angle to the opponent.", "Practice with a jab first: throw jab, then pivot immediately."], mistakes: ["Pivoting on the wrong foot — always the lead foot is the pivot point in orthodox.", "Not resuming your stance after the pivot.", "Pivoting without a punch — pivots should always be attached to a combination."] },
  "Technique Shadowboxing": { steps: ["Slow the pace down to 50-60% of max speed.", "Focus on ONE technical element per round: footwork, guard position, combo rhythm, defense.", "After each combination, reset your stance and guard before throwing again.", "Visualize a specific opponent with specific habits — make it tactical.", "Record yourself — you will catch errors you cannot feel."], mistakes: ["Going full speed — this round is about QUALITY, not intensity.", "Throwing random punches — every combination should have tactical logic.", "Forgetting defense — add a slip or roll to every combination."] },
  "Relaxation Drill": { steps: ["Shadowbox at 40-50% speed with the sole focus of keeping every muscle loose.", "Only tighten your fist and core at the exact moment of imagined impact.", "Shake your hands out between combinations.", "Focus on your breathing — exhale on every punch.", "Notice where you hold tension (shoulders, jaw) and consciously release it."], mistakes: ["Any tension between punches is wasted energy — let it go.", "Forgetting to breathe — tension and breath-holding go hand in hand."] },
  "Smooth Punch Flow": { steps: ["Think of your punches as water flowing — no beginning and no end, just movement.", "Each punch flows directly into the next without stopping or resetting.", "Explore longer combinations: 1-2-3-2-1-3-2.", "Move your feet between each combination.", "Speed comes naturally when you're relaxed — don't force it."], mistakes: ["Punching in 'batches' with pauses — it should be a continuous flow.", "Ignoring footwork — your feet set up every punch."] },
  "Defense Drill": { steps: ["Practice the slip: for a jab to your lead side, rotate slightly and move your head outside their lead shoulder.", "Practice the roll: for a hook, bend your knees and roll under the punch.", "Practice the block: catch punches on your guard (forearm or gloves).", "Link defense to offense: slip → counter cross, roll → body hook.", "Do this in rhythm — imagine a metronome and react on the beat."], mistakes: ["Moving your head only — defense requires whole-body movement.", "Defensive movements without counter punches — always make them pay.", "Making the movements too large — slip 3-6 inches, not a foot."] },
  "Foot Movement Patterns": { steps: ["Practice the box step: forward-left, backward-right, forming a square.", "Practice the triangle: three positions of a triangle, moving between them.", "Add punches to each position change.", "Circle your opponent: jab-step left-jab, jab-step left-jab.", "Work both directions: clockwise and counterclockwise."], mistakes: ["Practicing footwork without punches — they're inseparable in boxing.", "Moving to the opponent's power side — always move to your rear-hand side (right for orthodox)."] },
};

// ── DYNAMIC WORKOUT SCALING ─────────────────────────────────────────────────
const scaleWorkout = (user) => {
  if (!user) return null;
  const experience = user.experience || "beginner";
  const goal = user.goal || "improve performance";
  const bmi = parseFloat(user.bmi) || 22;

  // Multipliers by experience
  const mult = { beginner: 0.7, intermediate: 1.0, advanced: 1.3 }[experience];

  // Time scale: duration × mult, clamped
  const scaleTime = (base) => Math.round(Math.max(20, Math.min(base * mult, base * 1.5)) / 5) * 5;

  // Rep scale
  const scaleReps = (base) => {
    if (base === "Max") return "Max";
    if (typeof base === "string" && base.includes("/")) {
      const [num, side] = base.split("/");
      return `${Math.round(parseInt(num) * mult)}/${side}`;
    }
    return Math.round(parseInt(base) * mult);
  };

  // Set scale
  const scaleSets = (base) => {
    const b = parseInt(base) || 1;
    if (experience === "beginner") return Math.max(2, b - 1);
    if (experience === "advanced") return b + 1;
    return b;
  };

  // Intensity badge
  const intensityBadge = { beginner: "🟢 Beginner Intensity", intermediate: "🟡 Standard Intensity", advanced: "🔴 Advanced Intensity" }[experience];

  // Calorie estimate per day based on goal + weight
  const weight = parseFloat(user.weight) || 70;
  const calBase = goal === "lose fat" ? weight * 20 : goal === "build muscle" ? weight * 30 : weight * 25;

  const scaleDay = (dayData) => {
    if (dayData.isRest) return dayData;
    return {
      ...dayData,
      sections: dayData.sections.map(sec => ({
        ...sec,
        exercises: sec.exercises.map(ex => ({
          ...ex,
          duration: ex.duration ? scaleTime(ex.duration) : ex.duration,
          reps: ex.reps !== undefined ? scaleReps(ex.reps) : ex.reps,
          sets: ex.sets ? scaleSets(ex.sets) : ex.sets,
        })),
      })),
    };
  };

  return { mult, intensityBadge, calBase: Math.round(calBase), scaleDay };
};

// ── MORNING / EVENING SPLIT ────────────────────────────────────────────────
// Boxing-focused → morning; Physical conditioning → evening
const MORNING_SECTIONS = new Set([
  "Warm-Up (10 min)", "Warm-Up", "Boxing Rounds", "Footwork Drills",
  "Punch Speed Rounds", "Karlakattai Flow", "Karlakattai Training",
  "Karlakattai Shoulder Burnout", "Technical Shadowboxing", "Focus Points",
  "Boxing Combo Rounds", "Light Cardio",
]);

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
  const [googlePending, setGooglePending] = useState(null);
  const [breathScreen, setBreathScreen] = useState(null); // { duration, intensity, onDone }
  const intervalRef = useRef(null);
  const voiceAlertsRef = useRef(new Set());

  // Real streak computed from workoutDays in localStorage (no demo numbers)
  const getRealStreak = () => {
    try {
      const days = JSON.parse(localStorage.getItem("ironfist_workoutdays") || "[]");
      if (!days.length) return 0;
      let s = 0;
      for (let i = 0; i < 60; i++) {
        const d = new Date(); d.setDate(d.getDate() - i);
        if (days.includes(d.toLocaleDateString("en-GB"))) s++;
        else break;
      }
      return s;
    } catch { return 0; }
  };
  const streak = getRealStreak();

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

  // ── TDEE CALORIE CALCULATOR ──────────────────────────────────────────────────
  const calcTDEE = (u) => {
    if (!u) return null;
    const w = parseFloat(u.weight), h = parseFloat(u.height), a = parseFloat(u.age);
    if (!w || !h || !a) return null;
    // Mifflin-St Jeor BMR
    const bmr = u.gender === "female"
      ? 10 * w + 6.25 * h - 5 * a - 161
      : 10 * w + 6.25 * h - 5 * a + 5;
    // Activity multiplier — boxing 6×/week is heavy training
    const activityMult = { beginner: 1.55, intermediate: 1.725, advanced: 1.9 }[u.experience] || 1.55;
    const tdee = Math.round(bmr * activityMult);
    const goal = u.goal || "improve performance";
    const target = goal === "lose fat" ? Math.round(tdee * 0.82) : goal === "build muscle" ? Math.round(tdee * 1.1) : tdee;
    const protein = Math.round(w * (u.experience === "advanced" ? 2.2 : 2.0));
    const fat = Math.round(target * 0.28 / 9);
    const carbs = Math.round((target - protein * 4 - fat * 9) / 4);
    return { bmr: Math.round(bmr), tdee, target, protein, fat, carbs };
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    const bmi = updated.height && updated.weight ? calcBMI(updated.weight, updated.height) : updated.bmi;
    const final = { ...updated, bmi };
    try { localStorage.setItem("ironfist_user", JSON.stringify(final)); } catch (_) { }
    setUser(final);
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

  // Dynamic scaling engine
  const scaling = scaleWorkout(user);

  // get all exercises flat for active workout (with dynamic scaling applied)
  const getFlatExercises = (dayKey, sessionFilter) => {
    const raw = WORKOUT_DATA[dayKey];
    const day = scaling ? scaling.scaleDay(raw) : raw;
    let sections = day.sections;
    if (sessionFilter === "morning") sections = sections.filter(s => MORNING_SECTIONS.has(s.name));
    else if (sessionFilter === "evening") sections = sections.filter(s => !MORNING_SECTIONS.has(s.name));
    return sections.flatMap(s => s.exercises);
  };

  const startWorkout = (dayKey, sessionFilter) => {
    const exs = getFlatExercises(dayKey, sessionFilter);
    if (!exs.length) return;
    const label = sessionFilter === "morning" ? "🌅 MORNING" : sessionFilter === "evening" ? "🌆 EVENING" : "FULL";
    setActiveWorkout({ dayKey, exercises: exs, sessionLabel: label });
    setCurrentExerciseIdx(0);
    setCurrentSet(1);
    setRepCount(0);
    voiceAlertsRef.current = new Set();
    const first = exs[0];
    setTimer(first.duration || 0);
    setRunning(false);
    speak(`Starting ${label} workout. First exercise: ${first.name}.`);
    setScreen("active");
  };

  // Breathing duration based on exercise intensity
  const getBreathDuration = (ex) => {
    if (!ex) return 15;
    const name = (ex.name || "").toLowerCase();
    const dur = ex.duration || 0;
    // High intensity: burpees, jump squats, sprints, rounds, combinations → 25-30s
    if (name.includes("burpee") || name.includes("jump squat") || name.includes("clap") || name.includes("high knee") || name.includes("mountain") || name.includes("sprint") || (ex.unit === "time" && dur >= 120)) return 30;
    // Medium intensity: push-ups, pull-ups, shadowboxing, conditioning → 20s
    if (name.includes("push") || name.includes("pull") || name.includes("shadow") || name.includes("squat") || name.includes("lunge") || name.includes("chin") || name.includes("combo") || (ex.unit === "time" && dur >= 60)) return 20;
    // Low intensity: stretching, neck, breathing, plank, rest → 10s
    if (name.includes("stretch") || name.includes("breathing") || name.includes("rest") || name.includes("neck") || name.includes("isometric") || name.includes("plank") || ex.isRest) return 10;
    // Default moderate
    return 15;
  };

  const nextExercise = () => {
    const exs = activeWorkout.exercises;
    const currentEx = exs[currentExerciseIdx];
    const isLast = currentExerciseIdx >= exs.length - 1;
    const breathDur = getBreathDuration(currentEx);

    // Log today's workout on any exercise completion
    const today = new Date().toLocaleDateString("en-GB");
    try {
      const days = JSON.parse(localStorage.getItem("ironfist_workoutdays") || "[]");
      if (!days.includes(today)) {
        localStorage.setItem("ironfist_workoutdays", JSON.stringify([...days, today].slice(-60)));
      }
    } catch { }

    // Skip breath screen for rest periods and very short exercises
    const skipBreath = currentEx?.isRest || (currentEx?.unit !== "time" && !currentEx?.duration);

    if (skipBreath) {
      if (isLast) { finishWorkout(); }
      else {
        const next = exs[currentExerciseIdx + 1];
        setCurrentExerciseIdx(i => i + 1);
        setCurrentSet(1); setRepCount(0);
        voiceAlertsRef.current = new Set();
        setTimer(next.duration || 0); setRunning(false);
      }
      return;
    }

    setBreathScreen({
      duration: breathDur,
      intensity: breathDur >= 25 ? "high" : breathDur >= 18 ? "medium" : "low",
      exerciseName: currentEx.name,
      isLast,
      onDone: () => {
        setBreathScreen(null);
        if (isLast) { finishWorkout(); }
        else {
          const next = exs[currentExerciseIdx + 1];
          setCurrentExerciseIdx(i => i + 1);
          setCurrentSet(1); setRepCount(0);
          voiceAlertsRef.current = new Set();
          setTimer(next.duration || 0); setRunning(false);
        }
      },
    });
  };

  const finishWorkout = () => {
    speak("Workout complete! Outstanding effort! Remember to stretch and hydrate.");
    setScreen("home");
    setActiveWorkout(null);
  };

  // ── BREATHING TIMER SCREEN ───────────────────────────────────────────────────
  const BreathingScreen = () => {
    const [timeLeft, setTimeLeft] = useState(breathScreen.duration);
    const [phase, setPhase] = useState("inhale"); // inhale | hold | exhale | hold2
    const [phaseTime, setPhaseTime] = useState(4);
    const [phaseTick, setPhaseTick] = useState(4);
    const [started, setStarted] = useState(false);
    const breathRef = useRef(null);
    const boxDur = 4; // box breathing: 4-4-4-4

    const phases = ["inhale", "hold", "exhale", "hold2"];
    const phaseLabels = { inhale: "BREATHE IN", hold: "HOLD", exhale: "BREATHE OUT", hold2: "HOLD" };
    const phaseColors = { inhale: T.accent3, hold: T.accent2, exhale: T.green, hold2: T.purple };
    const phaseEmojis = { inhale: "🫁", hold: "🧘", exhale: "😮‍💨", hold2: "🧘" };

    const intensity = breathScreen.intensity;
    const ringR = 85;
    const circ = 2 * Math.PI * ringR;
    const totalDur = breathScreen.duration;
    const elapsed = totalDur - timeLeft;
    const overallPct = elapsed / totalDur;
    const ringOffset = circ * (1 - overallPct);

    // Phase animation scale (breathing circle pulse)
    const phaseProgress = 1 - phaseTick / boxDur;
    const circleScale = phase === "inhale" ? 1 + phaseProgress * 0.25
      : phase === "exhale" ? 1.25 - phaseProgress * 0.25
        : 1.25;

    useEffect(() => {
      if (!started) return;
      breathRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(breathRef.current);
            speak("Breathing complete. Well done!");
            setTimeout(() => breathScreen.onDone(), 600);
            return 0;
          }
          return t - 1;
        });
        setPhaseTick(pt => {
          if (pt <= 1) {
            setPhase(p => {
              const idx = phases.indexOf(p);
              const next = phases[(idx + 1) % phases.length];
              const label = phaseLabels[next];
              speak(label === "BREATHE IN" ? "Breathe in" : label === "BREATHE OUT" ? "Breathe out" : "Hold");
              return next;
            });
            return boxDur;
          }
          return pt - 1;
        });
      }, 1000);
      return () => clearInterval(breathRef.current);
    }, [started]);

    const intensityConfig = {
      high: { label: "HIGH INTENSITY RECOVERY", color: T.accent, tip: "Deep breaths — flush lactic acid fast" },
      medium: { label: "MODERATE RECOVERY", color: T.accent2, tip: "Steady box breathing to reset heart rate" },
      low: { label: "LIGHT RECOVERY", color: T.green, tip: "Gentle breathing to stay relaxed" },
    }[intensity] || { label: "RECOVERY BREATH", color: T.accent3, tip: "Breathe and recover" };

    return (
      <div style={{ ...s.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 24, background: dark ? "#060610" : "#f0f4ff" }}>
        {/* Header */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: dark ? "#0a0a18" : "#1a1a4e", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 16, color: "#fff", letterSpacing: 2 }}>BREATHING TIMER</div>
          <button onClick={() => { clearInterval(breathRef.current); breathScreen.onDone(); }} style={{ ...s.btn(T.sub, true), padding: "5px 12px", fontSize: 12 }}>Skip →</button>
        </div>

        <div style={{ textAlign: "center", marginBottom: 16, marginTop: 60 }}>
          <div style={{ ...s.badge(intensityConfig.color), display: "inline-block", marginBottom: 8 }}>{intensityConfig.label}</div>
          <div style={{ fontSize: 13, color: T.sub }}>{breathScreen.exerciseName} complete</div>
        </div>

        {/* Main breathing circle */}
        <div style={{ position: "relative", width: 240, height: 240, marginBottom: 24 }}>
          {/* Outer progress ring */}
          <svg width="240" height="240" viewBox="0 0 240 240" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
            <circle cx="120" cy="120" r={ringR} fill="none" stroke={T.border} strokeWidth="8" />
            <circle cx="120" cy="120" r={ringR} fill="none" stroke={intensityConfig.color} strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={ringOffset}
              style={{ transition: "stroke-dashoffset 0.9s linear" }} />
          </svg>

          {/* Breathing pulse circle */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: `translate(-50%, -50%) scale(${started ? circleScale : 1})`,
            width: 130, height: 130, borderRadius: "50%",
            background: `radial-gradient(circle, ${phaseColors[phase]}44, ${phaseColors[phase]}11)`,
            border: `3px solid ${phaseColors[phase]}88`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            transition: "transform 0.9s ease, background 0.5s, border-color 0.5s",
            boxShadow: started ? `0 0 30px ${phaseColors[phase]}44` : "none",
          }}>
            <div style={{ fontSize: 32 }}>{phaseEmojis[phase]}</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 12, letterSpacing: 2, color: phaseColors[phase], marginTop: 4 }}>
              {started ? phaseLabels[phase] : "READY"}
            </div>
          </div>

          {/* Countdown in corner */}
          <div style={{ position: "absolute", bottom: 8, right: 8, fontFamily: "'JetBrains Mono'", fontSize: 26, color: T.text, lineHeight: 1 }}>
            {timeLeft}s
          </div>
        </div>

        {/* Box breathing guide */}
        {started && (
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {phases.map((p, i) => (
              <div key={p} style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, letterSpacing: 1,
                background: phase === p ? phaseColors[p] + "33" : T.card2,
                color: phase === p ? phaseColors[p] : T.sub,
                border: `1px solid ${phase === p ? phaseColors[p] : T.border}`,
                transition: "all 0.3s",
              }}>
                {phaseLabels[p].split(" ")[0]}
              </div>
            ))}
          </div>
        )}

        <div style={{ fontSize: 13, color: T.sub, marginBottom: 24, textAlign: "center", maxWidth: 280 }}>{intensityConfig.tip}</div>

        {!started ? (
          <button onClick={() => {
            setStarted(true);
            speak("Breathe in");
          }} style={{ ...s.btn(intensityConfig.color, false), fontSize: 16, padding: "14px 32px", animation: "glow 2s infinite" }}>
            😮‍💨 Start Breathing
          </button>
        ) : (
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: T.sub, letterSpacing: 2 }}>
            {phaseTick}s · {phaseLabels[phase]}
          </div>
        )}
      </div>
    );
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
    const [showForm, setShowForm] = useState(false);
    if (!activeWorkout) return null;
    const ex = activeWorkout.exercises[currentExerciseIdx];
    const totalSets = ex.sets || 1;
    const formGuide = FORM_GUIDES[ex.name] || null;

    // Ring SVG timer constants
    const RING_R = 90;
    const CIRCUMFERENCE = 2 * Math.PI * RING_R; // ≈ 565.5
    const ringPct = ex.duration && ex.duration > 0
      ? Math.max(0, timer / ex.duration)
      : 0;
    const strokeDashoffset = CIRCUMFERENCE * (1 - ringPct);
    const ringColor = timer < 10 ? T.accent : ex.isRest ? T.accent3 : T.green;

    // Rep pct for rep-based bar
    const repPct = ex.reps
      ? (repCount / (ex.reps === "Max" ? 20 : parseInt(ex.reps || 1))) * 100
      : 0;

    const handleStartPause = () => {
      if (timer === 0) {
        voiceAlertsRef.current = new Set();
        setTimer(ex.duration);
        setRunning(false);
      } else if (!running) {
        speak(`Starting ${ex.name}. ${ex.sets ? `Set ${currentSet} of ${totalSets}.` : ""} Go!`);
        setRunning(true);
      } else {
        speak("Paused");
        setRunning(false);
      }
    };

    return (
      <div style={{ ...s.app, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ background: dark ? "#0a0a18" : "#1a1a4e", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => { setRunning(false); speak("Workout paused."); setScreen("home"); }} style={{ ...s.btn(T.accent, true), padding: "6px 14px", fontSize: 13 }}>✕ Exit</button>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 16, color: "#fff", letterSpacing: 2 }}>
            {activeWorkout.sessionLabel || WORKOUT_DATA[activeWorkout.dayKey].label}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: T.accent2 }}>
            {currentExerciseIdx + 1}/{activeWorkout.exercises.length}
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{ height: 5, background: T.border }}>
          <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.accent2})`, transition: "width 0.5s" }} />
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px 32px" }}>

          {/* Exercise name + set badge */}
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            {ex.isRest && <div style={{ ...s.badge(T.accent3), display: "inline-block", marginBottom: 6 }}>REST PERIOD</div>}
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 3, color: ex.isRest ? T.accent3 : T.text, lineHeight: 1 }}>{ex.name}</div>
            {ex.sets && (
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 6 }}>
                {Array.from({ length: totalSets }).map((_, i) => (
                  <div key={i} style={{ width: 28, height: 6, borderRadius: 3, background: i < currentSet ? T.accent : T.border, transition: "background 0.3s" }} />
                ))}
              </div>
            )}
            {ex.sets && <div style={{ color: T.sub, fontSize: 12, marginTop: 4, letterSpacing: 2 }}>SET {currentSet} OF {totalSets}</div>}
          </div>

          {/* ── NEW RING TIMER (from extracted timer) ── */}
          {ex.unit === "time" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 18 }}>
              <div style={{ position: "relative", width: 220, height: 220 }}>
                <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: "rotate(-90deg)" }}>
                  {/* Track */}
                  <circle cx="110" cy="110" r={RING_R} fill="none" stroke={T.border} strokeWidth="12" />
                  {/* Progress ring */}
                  <circle
                    cx="110" cy="110" r={RING_R}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
                  />
                </svg>
                {/* Centre: time + icon */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
                  <div style={{ fontSize: 28 }}>{ex.icon}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono'", fontSize: 46, lineHeight: 1,
                    color: timer < 10 ? T.accent : T.text,
                    animation: running && timer <= 5 ? "countPulse 0.5s infinite" : "none"
                  }}>
                    {fmt(timer)}
                  </div>
                  <div style={{ fontSize: 10, color: T.sub, letterSpacing: 3, marginTop: 2 }}>
                    {timer === 0 ? "DONE" : running ? "REMAINING" : "PAUSED"}
                  </div>
                </div>
                {/* Glow ring when running */}
                {running && (
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: `0 0 24px ${ringColor}55`, pointerEvents: "none" }} />
                )}
              </div>

              {/* Phase label */}
              <div style={{ ...s.badge(ex.isRest ? T.accent3 : ringColor), marginTop: 10, fontSize: 12, letterSpacing: 2 }}>
                {ex.isRest ? "😮‍💨 REST" : running ? "⚡ ACTIVE" : timer === 0 ? "✓ COMPLETE" : "⏸ READY"}
              </div>
            </div>
          ) : (
            /* Rep counter */
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{ex.icon}</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: T.sub, marginBottom: 4, letterSpacing: 2 }}>TARGET REPS</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 76, color: T.accent2, lineHeight: 1 }}>{ex.reps}</div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 16 }}>
                <button onClick={() => setRepCount(r => Math.max(0, r - 1))} style={{ ...s.btn(T.accent, true), width: 52, height: 52, borderRadius: "50%", justifyContent: "center", fontSize: 22, padding: 0 }}>−</button>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 60, color: T.text, lineHeight: 1 }}>{repCount}</div>
                  <div style={{ fontSize: 11, color: T.sub, letterSpacing: 2 }}>DONE</div>
                </div>
                <button onClick={() => setRepCount(r => r + 1)} style={{ ...s.btn(T.green, false), width: 52, height: 52, borderRadius: "50%", justifyContent: "center", fontSize: 22, padding: 0 }}>+</button>
              </div>
              {/* Rep progress bar */}
              <div style={{ margin: "12px auto 0", maxWidth: 220, height: 6, background: T.border, borderRadius: 3 }}>
                <div style={{ width: `${Math.min(repPct, 100)}%`, height: "100%", background: `linear-gradient(90deg,${T.accent2},${T.green})`, borderRadius: 3, transition: "width 0.2s" }} />
              </div>
            </div>
          )}

          {/* Controls */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
            <button onClick={prevExercise} disabled={currentExerciseIdx === 0} style={{ ...s.btn(T.sub, true), opacity: currentExerciseIdx === 0 ? 0.4 : 1, padding: "10px 16px" }}>← Prev</button>

            {ex.unit === "time" && (
              <button
                onClick={handleStartPause}
                style={{ ...s.btn(timer === 0 ? T.sub : running ? T.accent2 : T.green, false), minWidth: 130, justifyContent: "center", animation: !running && timer > 0 ? "glow 2s infinite" : "none" }}
              >
                {timer === 0 ? "↺ Redo" : running ? "⏸ Pause" : "▶ Start"}
              </button>
            )}

            <button
              onClick={() => {
                if (ex.sets && currentSet < totalSets) {
                  speak(`Set ${currentSet} complete. Rest, then get ready for set ${currentSet + 1}.`);
                  setCurrentSet(cs => cs + 1);
                  setRepCount(0);
                  voiceAlertsRef.current = new Set();
                  setTimer(ex.duration || 0);
                  setRunning(false);
                } else {
                  speak(currentExerciseIdx === activeWorkout.exercises.length - 1 ? "Workout complete! Outstanding effort!" : `${ex.name} done. Moving on.`);
                  nextExercise();
                }
              }}
              style={{ ...s.btn(T.accent, false), padding: "10px 18px" }}
            >
              {ex.sets && currentSet < totalSets ? `Next Set →` : currentExerciseIdx === activeWorkout.exercises.length - 1 ? "✓ Finish" : "Next →"}
            </button>
          </div>

          {/* Quick form cue */}
          <div style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: T.accent2, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>🎯 FORM CUE</div>
            <div style={{ fontSize: 15, color: T.text, lineHeight: 1.5 }}>{ex.cue}</div>
          </div>

          {/* Detailed perfect form guide */}
          {formGuide && (
            <div style={{ marginBottom: 16 }}>
              <button
                onClick={() => setShowForm(f => !f)}
                style={{ ...s.btn(T.accent3, true), width: "100%", justifyContent: "center", marginBottom: showForm ? 10 : 0, fontSize: 14 }}
              >
                {showForm ? "▲ Hide" : "▼ Show"} Perfect Form Guide
              </button>
              {showForm && (
                <div style={{ background: T.card, border: `1px solid ${T.accent3}33`, borderRadius: 12, padding: 16, animation: "slideUp 0.3s ease" }}>
                  <div style={{ fontSize: 12, color: T.accent3, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>✅ STEP-BY-STEP FORM</div>
                  {formGuide.steps.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                      <div style={{ background: T.accent3 + "33", color: T.accent3, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                      <div style={{ fontSize: 14, color: T.text, lineHeight: 1.5 }}>{step}</div>
                    </div>
                  ))}
                  {formGuide.mistakes && (
                    <>
                      <div style={{ fontSize: 12, color: T.accent, fontWeight: 700, letterSpacing: 2, marginTop: 12, marginBottom: 8 }}>⚠️ COMMON MISTAKES</div>
                      {formGuide.mistakes.map((m, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                          <div style={{ color: T.accent, fontSize: 14, flexShrink: 0 }}>✗</div>
                          <div style={{ fontSize: 14, color: T.sub, lineHeight: 1.5 }}>{m}</div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SVG illustration */}
          <div style={{ width: 160, height: 160, margin: "0 auto", background: dark ? "#ffffff06" : "#0000000a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}` }}>
            <div style={{ width: 120, height: 135 }}>
              <ExerciseSVG exerciseName={ex.name} dark={dark} />
            </div>
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
            try {
              const payload = JSON.parse(atob(response.credential.split(".")[1]));
              // Store google info and redirect to profile completion step
              setGooglePending({
                name: payload.name || "Fighter",
                email: payload.email || "",
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
    const rawDay = WORKOUT_DATA[todayKey];
    const dayData = scaling ? scaling.scaleDay(rawDay) : rawDay;
    const bmi = user?.bmi;
    const bmiCat = bmi ? getBMICategory(bmi) : null;

    // Split sections into morning/evening
    const morningSections = dayData.sections?.filter(s => MORNING_SECTIONS.has(s.name)) || [];
    const eveningSections = dayData.sections?.filter(s => !MORNING_SECTIONS.has(s.name)) || [];


    return (
      <div style={{ padding: 16 }}>
        {/* Hero greeting */}
        <div style={{ ...s.card, background: `linear-gradient(135deg, ${dayData.color}22, ${T.card})`, border: `1px solid ${dayData.color}44`, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, color: T.sub, letterSpacing: 2 }}>WELCOME BACK,</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: T.text, lineHeight: 1.1 }}>{user?.name?.toUpperCase() || "FIGHTER"}</div>
              <div style={{ marginTop: 6 }}>
                <span style={{ ...s.badge(dayData.color) }}>{dayData.label}</span>
                <span style={{ marginLeft: 6, fontSize: 13, color: T.sub }}>{dayData.theme}</span>
              </div>
              {scaling && (
                <div style={{ marginTop: 6, fontSize: 12, color: T.accent2, fontWeight: 700, letterSpacing: 1 }}>{scaling.intensityBadge}</div>
              )}
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
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              <button onClick={() => startWorkout(todayKey, "morning")} style={{ ...s.btn("#f39c12", false), flex: 1, justifyContent: "center", fontSize: 14, animation: "glow 2s infinite" }}>
                🌅 Morning Session
              </button>
              <button onClick={() => startWorkout(todayKey, "evening")} style={{ ...s.btn(dayData.color, false), flex: 1, justifyContent: "center", fontSize: 14 }}>
                🌆 Evening Session
              </button>
              <button onClick={() => startWorkout(todayKey, null)} style={{ ...s.btn(T.sub, true), width: "100%", justifyContent: "center", fontSize: 13 }}>
                🥊 Full Workout (All In One)
              </button>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            { n: bmi || "--", l: "BMI" },
            { n: user?.weight ? `${user.weight}kg` : "--", l: "Weight" },
            { n: weekNumber, l: "Week" },
            { n: scaling ? `×${scaling.mult.toFixed(1)}` : "--", l: "Intensity" },
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
                <div key={d} onClick={() => startWorkout(d, null)} style={{ flex: 1, textAlign: "center", cursor: "pointer", padding: "10px 4px", borderRadius: 10, background: isToday ? dayD.color + "33" : T.card2, border: `2px solid ${isToday ? dayD.color : T.border}`, transition: "all 0.2s" }}>
                  <div style={{ fontSize: 18 }}>{dayD.isRest ? "😴" : "🥊"}</div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 13, color: isToday ? dayD.color : T.sub, letterSpacing: 1 }}>{dayNames[i]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's plan — Morning / Evening split view */}
        {!dayData.isRest && (
          <div style={s.card}>
            <div style={s.sectionTitle}>TODAY'S PLAN</div>

            {/* Morning */}
            {morningSections.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ fontSize: 18 }}>🌅</div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: 2, color: "#f39c12" }}>MORNING — Boxing & Technique</div>
                </div>
                {morningSections.map((sec, si) => (
                  <div key={si} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: T.accent2, marginBottom: 6, textTransform: "uppercase", paddingLeft: 8, borderLeft: `3px solid ${T.accent2}` }}>{sec.name}</div>
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

            {/* Divider */}
            {morningSections.length > 0 && eveningSections.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 16px" }}>
                <div style={{ flex: 1, height: 1, background: T.border }} />
                <div style={{ fontSize: 11, color: T.sub, letterSpacing: 2 }}>EVENING SESSION</div>
                <div style={{ flex: 1, height: 1, background: T.border }} />
              </div>
            )}

            {/* Evening */}
            {eveningSections.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ fontSize: 18 }}>🌆</div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: 2, color: dayData.color }}>EVENING — Strength & Conditioning</div>
                </div>
                {eveningSections.map((sec, si) => (
                  <div key={si} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: dayData.color, marginBottom: 6, textTransform: "uppercase", paddingLeft: 8, borderLeft: `3px solid ${dayData.color}` }}>{sec.name}</div>
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

            {/* Knuckle Conditioning in Daily Plan */}
          </div>
        )}

        {/* Quick access */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Recovery", icon: "🧘", screen: "recovery", color: T.green },
            { label: "Diet Plan", icon: "🥗", screen: "diet", color: T.accent2 },
            { label: "My Goals", icon: "✨", screen: "knuckle", color: T.purple },
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
  const RecoveryScreen = () => {
    // activeStretch: { idx, timer, running, done }
    const [activeStretch, setActiveStretch] = useState(null);
    const [doneSets, setDoneSets] = useState({});
    const recIntervalRef = useRef(null);
    const recVoiceRef = useRef(new Set());

    // Ring constants
    const REC_R = 54;
    const REC_CIRC = 2 * Math.PI * REC_R;

    useEffect(() => {
      if (activeStretch?.running && activeStretch.timer > 0) {
        recIntervalRef.current = setInterval(() => {
          setActiveStretch(a => {
            if (!a) return null;
            const next = a.timer - 1;
            // voice alerts
            if (!recVoiceRef.current.has(next)) {
              if (next === 30 && a.total > 35) { recVoiceRef.current.add(next); setTimeout(() => speak("30 seconds"), 0); }
              else if (next === 10) { recVoiceRef.current.add(next); setTimeout(() => speak("10 seconds"), 0); }
              else if (next === 5) { recVoiceRef.current.add(next); setTimeout(() => speak("5"), 0); }
              else if (next === 3) { recVoiceRef.current.add(next); setTimeout(() => speak("3"), 0); }
              else if (next === 2) { recVoiceRef.current.add(next); setTimeout(() => speak("2"), 0); }
              else if (next === 1) { recVoiceRef.current.add(next); setTimeout(() => speak("1"), 0); }
            }
            return { ...a, timer: next };
          });
        }, 1000);
      } else if (activeStretch?.timer === 0 && activeStretch?.running) {
        clearInterval(recIntervalRef.current);
        speak("Done. Relax and breathe.");
        setActiveStretch(a => a ? { ...a, running: false, done: true } : null);
      }
      return () => clearInterval(recIntervalRef.current);
    }, [activeStretch?.running, activeStretch?.timer]);

    const startStretch = (idx) => {
      recVoiceRef.current = new Set();
      const str = RECOVERY_STRETCHES[idx];
      speak(`Starting ${str.name}. Hold for ${str.duration} seconds. Breathe deeply.`);
      setActiveStretch({ idx, timer: str.duration, total: str.duration, running: true, done: false });
    };

    const toggleStretch = (idx) => {
      if (!activeStretch || activeStretch.idx !== idx) { startStretch(idx); return; }
      if (activeStretch.done) { startStretch(idx); return; }
      if (activeStretch.running) {
        speak("Paused");
        setActiveStretch(a => ({ ...a, running: false }));
      } else {
        speak("Resuming");
        setActiveStretch(a => ({ ...a, running: true }));
      }
    };

    const completeStretch = (idx) => {
      setDoneSets(d => ({ ...d, [idx]: true }));
      setActiveStretch(null);
      clearInterval(recIntervalRef.current);
      const next = RECOVERY_STRETCHES[idx + 1];
      if (next) speak(`Great. Next: ${next.name}.`);
      else speak("All stretches complete. Excellent recovery session!");
    };

    return (
      <div style={{ padding: 16 }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 4, color: T.green, marginBottom: 4 }}>RECOVERY</div>
        <div style={{ fontSize: 13, color: T.sub, marginBottom: 4, letterSpacing: 2 }}>STRETCH & RESTORE</div>
        <div style={{ fontSize: 13, color: T.green, marginBottom: 20 }}>
          {Object.keys(doneSets).length}/{RECOVERY_STRETCHES.length} stretches complete
        </div>

        {RECOVERY_STRETCHES.map((str, i) => {
          const isActive = activeStretch?.idx === i;
          const isDone = doneSets[i];
          const timer = isActive ? activeStretch.timer : str.duration;
          const total = str.duration;
          const pct = isActive ? timer / total : (isDone ? 0 : 1);
          const ringColor = isDone ? T.green : isActive ? (activeStretch.timer < 6 ? T.accent : T.green) : T.green;
          const strokeOffset = REC_CIRC * pct;

          return (
            <div key={i} style={{
              ...s.card,
              border: `1px solid ${isDone ? T.green : isActive ? T.green + "88" : T.border}`,
              background: isDone ? T.green + "0a" : isActive ? T.green + "07" : T.card,
              transition: "all 0.3s"
            }}>
              {/* Header row */}
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: isActive ? 16 : 0 }}>

                {/* Mini ring timer */}
                <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
                  <svg width="64" height="64" viewBox="0 0 128 128" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="64" cy="64" r={REC_R} fill="none" stroke={T.border} strokeWidth="10" />
                    <circle
                      cx="64" cy="64" r={REC_R}
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={REC_CIRC}
                      strokeDashoffset={strokeOffset}
                      style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
                    />
                  </svg>
                  <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    textAlign: "center", pointerEvents: "none"
                  }}>
                    {isDone
                      ? <div style={{ fontSize: 20 }}>✓</div>
                      : <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: ringColor, lineHeight: 1, animation: isActive && activeStretch.timer <= 5 ? "countPulse 0.5s infinite" : "none" }}>
                        {fmt(timer)}
                      </div>
                    }
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <div style={{ fontFamily: "'Rajdhani'", fontWeight: 700, fontSize: 16, color: isDone ? T.green : T.text }}>{str.name}</div>
                    {isDone && <span style={{ ...s.badge(T.green), fontSize: 10 }}>✓ DONE</span>}
                    {isActive && activeStretch.running && <span style={{ ...s.badge(T.green), fontSize: 10 }}>⚡ ACTIVE</span>}
                    {isActive && !activeStretch.running && !activeStretch.done && <span style={{ ...s.badge(T.accent2), fontSize: 10 }}>⏸ PAUSED</span>}
                  </div>
                  <div style={{ ...s.badge(T.green), display: "inline-block", marginBottom: 6, fontSize: 11 }}>{str.muscle}</div>
                  <div style={{ fontSize: 13, color: T.sub, lineHeight: 1.4 }}>{str.cue}</div>
                </div>
              </div>

              {/* Expanded timer area when active */}
              {isActive && (
                <div style={{ background: dark ? "#0a160a" : "#f0fff4", borderRadius: 10, padding: "12px 16px", marginBottom: 12, textAlign: "center", animation: "slideUp 0.3s ease" }}>
                  {/* Big ring */}
                  <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 10px" }}>
                    <svg width="160" height="160" viewBox="0 0 220 220" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="110" cy="110" r="90" fill="none" stroke={T.border} strokeWidth="12" />
                      <circle
                        cx="110" cy="110" r="90"
                        fill="none"
                        stroke={activeStretch.timer < 6 ? T.accent : T.green}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 90}
                        strokeDashoffset={2 * Math.PI * 90 * (activeStretch.timer / total)}
                        style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
                      />
                    </svg>
                    {activeStretch.running && (
                      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: `0 0 20px ${T.green}44`, pointerEvents: "none" }} />
                    )}
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                      <div style={{ fontSize: 22 }}>🧘</div>
                      <div style={{
                        fontFamily: "'JetBrains Mono'", fontSize: 44, color: activeStretch.timer < 6 ? T.accent : T.green,
                        lineHeight: 1, animation: activeStretch.timer <= 5 && activeStretch.running ? "countPulse 0.5s infinite" : "none"
                      }}>
                        {fmt(activeStretch.timer)}
                      </div>
                      <div style={{ fontSize: 10, color: T.sub, letterSpacing: 2, marginTop: 2 }}>
                        {activeStretch.done ? "DONE" : activeStretch.running ? "HOLD" : "PAUSED"}
                      </div>
                    </div>
                  </div>

                  {/* Breathe cue */}
                  {activeStretch.running && (
                    <div style={{ fontSize: 13, color: T.green, letterSpacing: 2, animation: "pulse 4s ease-in-out infinite" }}>
                      ↑ INHALE &nbsp;&nbsp; ↓ EXHALE
                    </div>
                  )}
                </div>
              )}

              {/* Controls */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {!isDone && (
                  <button
                    onClick={() => toggleStretch(i)}
                    style={{ ...s.btn(activeStretch?.done && isActive ? T.sub : isActive && activeStretch.running ? T.accent2 : T.green, false), fontSize: 13, padding: "8px 18px", animation: !isActive && !isDone ? "glow 2s infinite" : "none" }}
                  >
                    {isActive
                      ? activeStretch.done ? "↺ Redo" : activeStretch.running ? "⏸ Pause" : "▶ Resume"
                      : "▶ Start"}
                  </button>
                )}
                {isActive && (activeStretch.done || !activeStretch.running) && (
                  <button
                    onClick={() => completeStretch(i)}
                    style={{ ...s.btn(T.green, false), fontSize: 13, padding: "8px 18px" }}
                  >
                    {i === RECOVERY_STRETCHES.length - 1 ? "✓ All Done" : "Next Stretch →"}
                  </button>
                )}
                {isDone && (
                  <button onClick={() => { setDoneSets(d => { const n = { ...d }; delete n[i]; return n; }); }} style={{ ...s.btn(T.sub, true), fontSize: 12, padding: "6px 12px" }}>
                    ↺ Redo
                  </button>
                )}
              </div>
            </div>
          );
        })}

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
  };

  // ── DIET SCREEN ──────────────────────────────────────────────────────────────
  const DietScreen = () => {
    const plan = DIET_PLANS[user?.goal || "improve performance"];
    const tdee = calcTDEE(user);

    // ── FOOD CALORIE CALCULATOR ──
    const FOOD_DB = {
      "Rice (cooked)": 1.3, "Rice (raw)": 3.6, "Oats": 3.89, "Bread (white)": 2.65, "Bread (whole wheat)": 2.47,
      "Pasta (cooked)": 1.57, "Potato (boiled)": 0.87, "Sweet Potato": 0.86, "Banana": 0.89,
      "Apple": 0.52, "Orange": 0.47, "Mango": 0.60, "Dates": 2.77,
      "Chicken Breast": 1.65, "Chicken Thigh": 2.09, "Egg (whole)": 1.55, "Egg White": 0.52,
      "Tuna (canned)": 1.32, "Salmon": 2.08, "Sardines": 1.85,
      "Beef (lean)": 2.50, "Mutton": 2.94, "Pork": 2.42,
      "Milk (whole)": 0.61, "Milk (skim)": 0.34, "Curd / Yoghurt": 0.61, "Paneer": 2.65,
      "Whey Protein (powder)": 4.0, "Peanut Butter": 5.88, "Almonds": 5.79,
      "Olive Oil": 8.84, "Coconut Oil": 8.62, "Ghee": 8.99,
      "Lentils (cooked)": 1.16, "Chickpeas (cooked)": 1.64, "Black Beans": 1.32,
      "Spinach": 0.23, "Broccoli": 0.34, "Carrot": 0.41, "Cucumber": 0.15, "Tomato": 0.18,
    };
    const [foodItems, setFoodItems] = useState([]);
    const [foodForm, setFoodForm] = useState({ name: "", grams: "", custom_cal: "" });
    const [useCustom, setUseCustom] = useState(false);
    const [mealName, setMealName] = useState("Breakfast");
    const [savedMeals, setSavedMeals] = useState(() => {
      try { return JSON.parse(localStorage.getItem("ironfist_meals") || "{}"); } catch { return {}; }
    });

    const addFood = () => {
      const g = parseFloat(foodForm.grams);
      if (!foodForm.name || !g) return;
      let cal;
      if (useCustom && foodForm.custom_cal) {
        cal = parseFloat(foodForm.custom_cal);
      } else {
        const kcalPer100 = FOOD_DB[foodForm.name];
        if (!kcalPer100) return;
        cal = Math.round(kcalPer100 * g);
      }
      const item = {
        id: Date.now(),
        name: foodForm.name || "Custom Food",
        grams: g,
        calories: cal,
        protein: foodForm.name ? Math.round((FOOD_DB[foodForm.name] ? g * (["Chicken Breast", "Tuna (canned)", "Egg White", "Whey Protein (powder)", "Salmon"].includes(foodForm.name) ? 0.22 : ["Egg (whole)", "Beef (lean)", "Mutton"].includes(foodForm.name) ? 0.20 : ["Lentils (cooked)", "Chickpeas (cooked)"].includes(foodForm.name) ? 0.09 : 0.04) : 0)) : 0,
      };
      setFoodItems(prev => [...prev, item]);
      setFoodForm(f => ({ ...f, grams: "", custom_cal: "" }));
    };

    const removeFood = (id) => setFoodItems(prev => prev.filter(f => f.id !== id));

    const totalCals = foodItems.reduce((sum, f) => sum + f.calories, 0);
    const totalProtein = foodItems.reduce((sum, f) => sum + (f.protein || 0), 0);
    const remaining = tdee ? tdee.target - totalCals : null;

    const saveMeal = () => {
      if (!foodItems.length) return;
      const updated = { ...savedMeals, [mealName]: { items: foodItems, total: totalCals, date: new Date().toLocaleDateString("en-GB") } };
      setSavedMeals(updated);
      try { localStorage.setItem("ironfist_meals", JSON.stringify(updated)); } catch { }
    };

    const loadMeal = (name) => {
      if (savedMeals[name]) setFoodItems(savedMeals[name].items);
    };

    return (
      <div style={{ padding: 16 }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 4, color: T.accent2, marginBottom: 4 }}>DIET PLAN</div>
        <div style={{ fontSize: 13, color: T.sub, marginBottom: 8, letterSpacing: 2 }}>FUEL YOUR PERFORMANCE</div>

        {/* Live calorie banner */}
        {tdee ? (
          <div style={{ ...s.card, background: `linear-gradient(135deg, ${T.accent2}18, ${T.card})`, border: `1px solid ${T.accent2}55`, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 44, color: T.accent2, lineHeight: 1 }}>{tdee.target}</div>
                <div style={{ fontSize: 11, color: T.sub, letterSpacing: 2 }}>DAILY KCAL TARGET</div>
                <div style={{ fontSize: 12, color: T.sub, marginTop: 4 }}>
                  {user?.goal === "lose fat" ? "🔥 −18% deficit" : user?.goal === "build muscle" ? "💪 +10% surplus" : "⚡ Maintenance"}
                  {" · "}TDEE {tdee.tdee} kcal
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {[["🥩", tdee.protein + "g", "Protein", T.accent], ["🍚", tdee.carbs + "g", "Carbs", T.accent2], ["🥑", tdee.fat + "g", "Fat", T.green]].map(([icon, val, lbl, color]) => (
                  <div key={lbl} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18 }}>{icon}</div>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 16, color, fontWeight: 700 }}>{val}</div>
                    <div style={{ fontSize: 10, color: T.sub }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 11, color: T.sub, marginTop: 8, fontStyle: "italic" }}>
              Personalised for your profile · Update in 👤 Profile to recalculate
            </div>
          </div>
        ) : (
          <div style={{ ...s.badge(T.accent2), display: "inline-block", marginBottom: 16, fontSize: 13 }}>Goal: {user?.goal?.toUpperCase() || "PERFORMANCE"} — {plan.calories}</div>
        )}

        {/* ══ FOOD CALORIE CALCULATOR ══ */}
        <div style={{ ...s.card, border: `1px solid ${T.green}44`, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 3, color: T.green, marginBottom: 4 }}>🍽️ FOOD CALORIE CALCULATOR</div>
          <div style={{ fontSize: 12, color: T.sub, marginBottom: 14, letterSpacing: 1 }}>Track exactly what you eat and see calories in real time</div>

          {/* Totals dashboard */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
            {[
              { label: "Calories Eaten", val: totalCals, color: T.accent2, unit: "kcal" },
              { label: "Protein", val: `~${totalProtein}`, color: T.accent, unit: "g" },
              { label: remaining !== null ? (remaining >= 0 ? "Remaining" : "Over by") : "Target", val: remaining !== null ? Math.abs(remaining) : (tdee?.target || "—"), color: remaining !== null ? (remaining >= 0 ? T.green : T.accent) : T.sub, unit: "kcal" },
            ].map((st, i) => (
              <div key={i} style={{ background: T.card2, borderRadius: 10, padding: "10px 8px", textAlign: "center", border: `1px solid ${st.color}22` }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 20, color: st.color, lineHeight: 1 }}>{st.val}</div>
                <div style={{ fontSize: 9, color: st.color, letterSpacing: 1, marginTop: 2 }}>{st.unit}</div>
                <div style={{ fontSize: 9, color: T.sub, marginTop: 2 }}>{st.label}</div>
              </div>
            ))}
          </div>

          {/* Calorie bar vs target */}
          {tdee && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.sub, marginBottom: 3 }}>
                <span>0 kcal</span><span>Target: {tdee.target} kcal</span>
              </div>
              <div style={{ height: 10, background: T.border, borderRadius: 5, overflow: "hidden" }}>
                <div style={{ width: `${Math.min((totalCals / tdee.target) * 100, 100)}%`, height: "100%", background: totalCals > tdee.target ? T.accent : totalCals > tdee.target * 0.9 ? T.accent2 : T.green, borderRadius: 5, transition: "width 0.5s, background 0.3s" }} />
              </div>
              <div style={{ textAlign: "right", fontSize: 10, color: totalCals > tdee.target ? T.accent : T.sub, marginTop: 2 }}>
                {Math.round((totalCals / tdee.target) * 100)}% of daily target
              </div>
            </div>
          )}

          {/* Add food form */}
          <div style={{ background: T.card2, borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: T.accent2, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>ADD FOOD ITEM</div>

            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button onClick={() => setUseCustom(false)} style={{ ...s.btn(!useCustom ? T.green : T.sub, useCustom), flex: 1, justifyContent: "center", fontSize: 12, padding: "8px 4px" }}>📚 From Database</button>
              <button onClick={() => setUseCustom(true)} style={{ ...s.btn(useCustom ? T.accent2 : T.sub, !useCustom), flex: 1, justifyContent: "center", fontSize: 12, padding: "8px 4px" }}>✏️ Custom Entry</button>
            </div>

            {!useCustom ? (
              <div style={{ marginBottom: 8 }}>
                <label style={s.label}>Select Food</label>
                <select value={foodForm.name} onChange={e => setFoodForm(f => ({ ...f, name: e.target.value }))} style={{ ...s.input, marginBottom: 0 }}>
                  <option value="">— Choose a food —</option>
                  {Object.entries({
                    "🍚 Grains & Carbs": ["Rice (cooked)", "Rice (raw)", "Oats", "Bread (white)", "Bread (whole wheat)", "Pasta (cooked)", "Potato (boiled)", "Sweet Potato"],
                    "🍎 Fruits": ["Banana", "Apple", "Orange", "Mango", "Dates"],
                    "🥩 Proteins": ["Chicken Breast", "Chicken Thigh", "Egg (whole)", "Egg White", "Tuna (canned)", "Salmon", "Sardines", "Beef (lean)", "Mutton", "Pork"],
                    "🥛 Dairy": ["Milk (whole)", "Milk (skim)", "Curd / Yoghurt", "Paneer"],
                    "💪 Supplements & Fats": ["Whey Protein (powder)", "Peanut Butter", "Almonds", "Olive Oil", "Coconut Oil", "Ghee"],
                    "🫘 Legumes": ["Lentils (cooked)", "Chickpeas (cooked)", "Black Beans"],
                    "🥦 Vegetables": ["Spinach", "Broccoli", "Carrot", "Cucumber", "Tomato"],
                  }).map(([group, items]) => (
                    <optgroup key={group} label={group}>
                      {items.map(item => (
                        <option key={item} value={item}>{item} — {FOOD_DB[item]} kcal/g</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {foodForm.name && FOOD_DB[foodForm.name] && (
                  <div style={{ fontSize: 11, color: T.green, marginTop: 4 }}>
                    📊 {FOOD_DB[foodForm.name]} kcal per gram · {Math.round(FOOD_DB[foodForm.name] * 100)} kcal per 100g
                  </div>
                )}
              </div>
            ) : (
              <div style={{ marginBottom: 8 }}>
                <label style={s.label}>Food Name</label>
                <input style={s.input} placeholder="e.g. Idli, Dosa, Dal..." value={foodForm.name} onChange={e => setFoodForm(f => ({ ...f, name: e.target.value }))} />
                <label style={s.label}>Calories (kcal)</label>
                <input type="number" style={s.input} placeholder="Total calories for this serving" value={foodForm.custom_cal} onChange={e => setFoodForm(f => ({ ...f, custom_cal: e.target.value }))} />
              </div>
            )}

            <label style={s.label}>Weight / Portion (grams)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="number" value={foodForm.grams} onChange={e => setFoodForm(f => ({ ...f, grams: e.target.value }))} placeholder="e.g. 200" style={{ ...s.input, flex: 1, marginBottom: 0 }} />
              <button onClick={addFood} style={{ ...s.btn(T.green, false), padding: "10px 18px", whiteSpace: "nowrap" }}>+ Add</button>
            </div>

            {/* Quick gram presets */}
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              {[50, 100, 150, 200, 250, 300].map(g => (
                <button key={g} onClick={() => setFoodForm(f => ({ ...f, grams: String(g) }))} style={{ ...s.badge(foodForm.grams === String(g) ? T.green : T.sub), cursor: "pointer", fontSize: 12, border: `1px solid ${foodForm.grams === String(g) ? T.green : T.border}` }}>{g}g</button>
              ))}
            </div>
          </div>

          {/* Food list */}
          {foodItems.length > 0 ? (
            <div>
              <div style={{ fontSize: 11, color: T.sub, letterSpacing: 2, marginBottom: 8 }}>ITEMS ADDED ({foodItems.length})</div>
              {foodItems.map((item, i) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: T.card2, borderRadius: 8, marginBottom: 6, border: `1px solid ${T.border}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: T.sub }}>{item.grams}g{item.protein ? ` · ~${item.protein}g protein` : ""}</div>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 16, color: T.accent2, fontWeight: 700 }}>{item.calories}</div>
                  <div style={{ fontSize: 11, color: T.sub }}>kcal</div>
                  <button onClick={() => removeFood(item.id)} style={{ background: "none", border: "none", color: T.accent, cursor: "pointer", fontSize: 16, padding: "0 4px" }}>✕</button>
                </div>
              ))}

              {/* Save meal */}
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <select value={mealName} onChange={e => setMealName(e.target.value)} style={{ ...s.input, flex: 1, marginBottom: 0 }}>
                  {["Breakfast", "Morning Snack", "Lunch", "Pre-Workout", "Post-Workout", "Dinner", "Late Snack"].map(m => <option key={m}>{m}</option>)}
                </select>
                <button onClick={saveMeal} style={{ ...s.btn(T.accent2, false), padding: "10px 14px", whiteSpace: "nowrap" }}>💾 Save</button>
                <button onClick={() => setFoodItems([])} style={{ ...s.btn(T.sub, true), padding: "10px 10px" }}>🗑️</button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0", color: T.sub, fontSize: 13 }}>
              No items added yet. Select a food and enter grams above 👆
            </div>
          )}

          {/* Saved meals */}
          {Object.keys(savedMeals).length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: T.sub, letterSpacing: 2, marginBottom: 8 }}>SAVED MEALS</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {Object.entries(savedMeals).map(([name, meal]) => (
                  <button key={name} onClick={() => loadMeal(name)} style={{ ...s.btn(T.accent2, true), fontSize: 12, padding: "6px 12px", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                    <span style={{ fontWeight: 700 }}>{name}</span>
                    <span style={{ fontSize: 10, color: T.sub }}>{meal.total} kcal · {meal.date}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Meal plan */}
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
          {[
            `Water: ${user?.weight ? Math.round(parseFloat(user.weight) * 0.04 * 10) / 10 : "3–4"}L daily, extra on training days`,
            "Creatine: 5g daily (post-workout)",
            `Protein: ${user?.weight ? Math.round(parseFloat(user.weight) * 2.0) : "120–180"}g daily target`,
            "Carbs: highest on training days",
            "Omega-3: 1–2g fish oil daily",
            "Magnesium: 400mg at night for recovery"
          ].map((tip, i) => (
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

  // ── TRAINING TOOLS SCREEN (Personal Goals + Horse Stance Pipeline) ──────────
  const TrainingToolsScreen = () => {
    // ── PERSONAL GOALS STATE ──
    const [goals, setGoals] = useState(() => {
      try { return JSON.parse(localStorage.getItem("ironfist_personalgoals") || "[]"); } catch { return []; }
    });
    const [goalForm, setGoalForm] = useState({ name: "", category: "life", deadline: "", notes: "" });
    const [showGoalAdd, setShowGoalAdd] = useState(false);
    const [editGoalIdx, setEditGoalIdx] = useState(null);
    const [filterCat, setFilterCat] = useState("all");

    const saveGoals = (items) => {
      setGoals(items);
      try { localStorage.setItem("ironfist_personalgoals", JSON.stringify(items)); } catch { }
    };

    const categoryConfig = {
      life: { color: "#8e44ad", icon: "✨", label: "Life" },
      learn: { color: "#2980b9", icon: "📚", label: "Learn" },
      health: { color: "#27ae60", icon: "🌿", label: "Health" },
      money: { color: "#f39c12", icon: "💰", label: "Money" },
      social: { color: "#e74c3c", icon: "🤝", label: "Social" },
      mindset: { color: "#16a085", icon: "🧠", label: "Mindset" },
      other: { color: "#7f8c8d", icon: "🎯", label: "Other" },
    };

    const addGoal = () => {
      if (!goalForm.name.trim()) return;
      const item = {
        id: Date.now(),
        name: goalForm.name.trim(),
        category: goalForm.category,
        deadline: goalForm.deadline,
        notes: goalForm.notes.trim(),
        done: false,
        addedDate: new Date().toLocaleDateString("en-GB"),
        doneDate: null,
      };
      if (editGoalIdx !== null) {
        const updated = goals.map((g, i) => i === editGoalIdx ? { ...g, ...item, id: g.id, done: g.done, addedDate: g.addedDate, doneDate: g.doneDate } : g);
        saveGoals(updated);
        setEditGoalIdx(null);
      } else {
        saveGoals([...goals, item]);
      }
      setGoalForm({ name: "", category: "life", deadline: "", notes: "" });
      setShowGoalAdd(false);
    };

    const toggleDone = (idx) => {
      const updated = goals.map((g, i) => i === idx ? { ...g, done: !g.done, doneDate: !g.done ? new Date().toLocaleDateString("en-GB") : null } : g);
      saveGoals(updated);
    };

    const deleteGoal = (idx) => saveGoals(goals.filter((_, i) => i !== idx));

    const startEditGoal = (idx) => {
      const g = goals[idx];
      setGoalForm({ name: g.name, category: g.category, deadline: g.deadline || "", notes: g.notes });
      setEditGoalIdx(idx);
      setShowGoalAdd(true);
    };

    const cats = ["all", ...Object.keys(categoryConfig)];
    const doneCount = goals.filter(g => g.done).length;
    const donePct = goals.length > 0 ? Math.round((doneCount / goals.length) * 100) : 0;

    const visibleGoals = goals
      .map((g, i) => ({ ...g, _idx: i }))
      .filter(g => filterCat === "all" || g.category === filterCat)
      .sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline);
        if (a.deadline) return -1;
        if (b.deadline) return 1;
        return b.id - a.id;
      });

    // ── HORSE STANCE STATE ──
    const [horseLog, setHorseLog] = useState(() => {
      try { return JSON.parse(localStorage.getItem("ironfist_horsestance") || "{}"); } catch { return {}; }
    });
    const [activeHorse, setActiveHorse] = useState(null); // { levelIdx, timer, running, best }
    const horseRef = useRef(null);

    const saveHorseLog = (log) => {
      setHorseLog(log);
      try { localStorage.setItem("ironfist_horsestance", JSON.stringify(log)); } catch { }
    };

    useEffect(() => {
      if (activeHorse?.running) {
        horseRef.current = setInterval(() => {
          setActiveHorse(a => a ? { ...a, timer: a.timer + 1 } : null);
        }, 1000);
      } else {
        clearInterval(horseRef.current);
      }
      return () => clearInterval(horseRef.current);
    }, [activeHorse?.running]);

    const startHorseTimer = (levelIdx) => {
      setActiveHorse({ levelIdx, timer: 0, running: true });
      speak("Horse stance. Begin. Breathe through your nose.");
    };

    const stopHorseTimer = (levelIdx) => {
      if (!activeHorse) return;
      clearInterval(horseRef.current);
      const elapsed = activeHorse.timer;
      const key = `level_${levelIdx}`;
      const prev = horseLog[key] || { best: 0, sessions: [] };
      const isNewBest = elapsed > prev.best;
      const updated = {
        ...horseLog,
        [key]: {
          best: Math.max(prev.best, elapsed),
          sessions: [...(prev.sessions || []).slice(-20), { date: new Date().toLocaleDateString("en-GB"), duration: elapsed }],
        },
      };
      saveHorseLog(updated);
      setActiveHorse(null);
      if (isNewBest) speak(`New personal best! ${elapsed} seconds. Outstanding!`);
      else speak(`${elapsed} seconds. Well done. Keep building.`);
    };

    const currentUnlockedLevel = (() => {
      for (let i = HORSE_STANCE_LEVELS.length - 1; i >= 0; i--) {
        const key = `level_${i}`;
        const log = horseLog[key];
        if (log && log.best >= HORSE_STANCE_LEVELS[i].duration) return i + 1;
      }
      return 0;
    })();

    return (
      <div style={{ padding: 16 }}>

        {/* ── SECTION: PERSONAL GOALS ── */}
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 4, color: T.purple, marginBottom: 2 }}>PERSONAL</div>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 3, color: T.sub, marginBottom: 16 }}>GOALS</div>

        {/* Summary bar */}
        {goals.length > 0 && (
          <div style={{ ...s.card, marginBottom: 16, padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: T.sub, letterSpacing: 2 }}>OVERALL PROGRESS</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: T.purple }}>{doneCount} / {goals.length} done</div>
            </div>
            <div style={{ height: 8, background: T.border, borderRadius: 4, marginBottom: 6 }}>
              <div style={{ width: `${donePct}%`, height: "100%", background: `linear-gradient(90deg, ${T.purple}, ${T.green})`, borderRadius: 4, transition: "width 0.6s" }} />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
              {Object.entries(categoryConfig).map(([key, cfg]) => {
                const count = goals.filter(g => g.category === key).length;
                if (!count) return null;
                return <span key={key} style={{ ...s.badge(cfg.color), fontSize: 10 }}>{cfg.icon} {cfg.label} {count}</span>;
              })}
            </div>
          </div>
        )}

        {/* Category filter */}
        {goals.length > 0 && (
          <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 4 }}>
            {cats.map(c => {
              const cfg = categoryConfig[c];
              const active = filterCat === c;
              return (
                <button key={c} onClick={() => setFilterCat(c)}
                  style={{ ...s.btn(cfg ? cfg.color : T.accent3, !active), padding: "5px 12px", fontSize: 12, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {cfg ? `${cfg.icon} ${cfg.label}` : "🌐 All"}
                </button>
              );
            })}
          </div>
        )}

        {/* Add / edit form */}
        {showGoalAdd && (
          <div style={{ ...s.card, marginBottom: 16, border: `1px solid ${T.purple}44`, animation: "slideUp 0.3s ease" }}>
            <div style={{ fontSize: 14, color: T.purple, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>
              {editGoalIdx !== null ? "✏️ EDIT GOAL" : "➕ NEW GOAL"}
            </div>
            <label style={s.label}>What's your goal? *</label>
            <input style={s.input} placeholder="e.g. Read 12 books this year" value={goalForm.name}
              onChange={e => setGoalForm(f => ({ ...f, name: e.target.value }))} />

            <label style={s.label}>Category</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {Object.entries(categoryConfig).map(([key, cfg]) => (
                <button key={key} onClick={() => setGoalForm(f => ({ ...f, category: key }))}
                  style={{ ...s.btn(goalForm.category === key ? cfg.color : T.sub, goalForm.category !== key), padding: "6px 12px", fontSize: 12, flexShrink: 0 }}>
                  {cfg.icon} {cfg.label}
                </button>
              ))}
            </div>

            <label style={s.label}>Target Date (optional)</label>
            <input style={s.input} type="date" value={goalForm.deadline}
              onChange={e => setGoalForm(f => ({ ...f, deadline: e.target.value }))} />

            <label style={s.label}>Notes / Why this matters (optional)</label>
            <input style={s.input} placeholder="e.g. Been putting this off for 2 years — just do it" value={goalForm.notes}
              onChange={e => setGoalForm(f => ({ ...f, notes: e.target.value }))} />

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button onClick={() => { setShowGoalAdd(false); setEditGoalIdx(null); setGoalForm({ name: "", category: "life", deadline: "", notes: "" }); }}
                style={{ ...s.btn(T.sub, true), flex: 1, justifyContent: "center" }}>✕ Cancel</button>
              <button onClick={addGoal} disabled={!goalForm.name.trim()}
                style={{ ...s.btn(T.purple, false), flex: 2, justifyContent: "center", opacity: !goalForm.name.trim() ? 0.5 : 1 }}>
                {editGoalIdx !== null ? "✓ Update" : "✓ Add Goal"}
              </button>
            </div>
          </div>
        )}

        {!showGoalAdd && (
          <button onClick={() => setShowGoalAdd(true)}
            style={{ ...s.btn(T.purple, true), width: "100%", justifyContent: "center", marginBottom: 16, fontSize: 14 }}>
            ＋ Add Personal Goal
          </button>
        )}

        {/* Goals list */}
        {goals.length === 0 ? (
          <div style={{ ...s.card, textAlign: "center", padding: "32px 16px", color: T.sub, marginBottom: 24 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🌱</div>
            <div style={{ fontSize: 14, lineHeight: 1.7 }}>
              Add personal goals that have nothing to do with fitness — things you want to learn, do, experience, or become. Track them alongside your training.
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 24 }}>
            {visibleGoals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: T.sub, fontSize: 13 }}>No goals in this category yet.</div>
            ) : visibleGoals.map((goal) => {
              const cfg = categoryConfig[goal.category] || categoryConfig.other;
              const hasDeadline = !!goal.deadline;
              const deadlineDate = hasDeadline ? new Date(goal.deadline) : null;
              const today = new Date(); today.setHours(0, 0, 0, 0);
              const daysLeft = deadlineDate ? Math.ceil((deadlineDate - today) / 86400000) : null;
              const overdue = daysLeft !== null && daysLeft < 0 && !goal.done;
              const soon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7 && !goal.done;

              return (
                <div key={goal.id} style={{ ...s.card, marginBottom: 10, border: `1px solid ${goal.done ? T.green : overdue ? T.accent : cfg.color}33`, background: goal.done ? T.green + "07" : overdue ? T.accent + "07" : T.card, transition: "all 0.3s" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    {/* Checkbox */}
                    <button onClick={() => toggleDone(goal._idx)}
                      style={{ width: 28, height: 28, borderRadius: 6, border: `2px solid ${goal.done ? T.green : cfg.color}`, background: goal.done ? T.green : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, fontSize: 14, transition: "all 0.2s" }}>
                      {goal.done ? <span style={{ color: "#fff" }}>✓</span> : <span style={{ color: cfg.color }}>{cfg.icon}</span>}
                    </button>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: goal.done ? T.sub : T.text, textDecoration: goal.done ? "line-through" : "none", marginBottom: 3 }}>
                        {goal.name}
                      </div>

                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: goal.notes ? 4 : 0 }}>
                        <span style={{ ...s.badge(cfg.color), fontSize: 10 }}>{cfg.icon} {cfg.label}</span>
                        {goal.done && <span style={{ ...s.badge(T.green), fontSize: 10 }}>✓ Done · {goal.doneDate}</span>}
                        {overdue && <span style={{ ...s.badge(T.accent), fontSize: 10 }}>⚠️ Overdue {Math.abs(daysLeft)}d</span>}
                        {soon && <span style={{ ...s.badge(T.accent2), fontSize: 10 }}>⏰ {daysLeft === 0 ? "Today!" : `${daysLeft}d left`}</span>}
                        {hasDeadline && !goal.done && !overdue && !soon && <span style={{ ...s.badge(T.sub), fontSize: 10 }}>📅 {deadlineDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>}
                      </div>

                      {goal.notes ? <div style={{ fontSize: 12, color: T.sub, marginTop: 2, lineHeight: 1.5 }}>{goal.notes}</div> : null}
                    </div>

                    {/* Edit / delete */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                      <button onClick={() => startEditGoal(goal._idx)} style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 6, padding: "3px 8px", color: T.sub, cursor: "pointer", fontSize: 11 }}>✏️</button>
                      <button onClick={() => deleteGoal(goal._idx)} style={{ background: "transparent", border: `1px solid ${T.accent}33`, borderRadius: 6, padding: "3px 8px", color: T.accent, cursor: "pointer", fontSize: 11 }}>✕</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SECTION: HORSE STANCE PIPELINE ── */}
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 4, color: T.accent3, marginBottom: 2 }}>HORSE</div>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 3, color: T.sub, marginBottom: 4 }}>STANCE PIPELINE</div>
        <div style={{ fontFamily: "'Rajdhani'", fontSize: 13, color: T.accent3, letterSpacing: 2, marginBottom: 16 }}>马步 Mǎ Bù — Beginner → Shaolin Entry</div>

        <div style={{ ...s.card, background: T.accent3 + "0d", border: `1px solid ${T.accent3}33`, marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: T.sub, lineHeight: 1.8 }}>
            <strong style={{ color: T.accent3 }}>Why Horse Stance?</strong> Shaolin Kung Fu is built on this foundation. It forges iron legs, deep hip mobility, mental toughness, and rooted power — the same power that makes a punch land differently. Train it separately from your boxing sessions. Practice daily or every other day. Progress is measured in seconds held.
          </div>
        </div>

        {/* Progress pipeline visual */}
        <div style={{ ...s.card, marginBottom: 20, padding: "16px 12px" }}>
          <div style={{ fontSize: 12, color: T.sub, letterSpacing: 2, marginBottom: 12 }}>YOUR PIPELINE</div>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {HORSE_STANCE_LEVELS.map((lvl, i) => {
              const key = `level_${i}`;
              const log = horseLog[key];
              const best = log?.best || 0;
              const passed = best >= lvl.duration;
              const isActive = i === currentUnlockedLevel;
              const pct = Math.min(100, Math.round((best / lvl.duration) * 100));
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                  {/* Connector line */}
                  {i < HORSE_STANCE_LEVELS.length - 1 && (
                    <div style={{ position: "absolute", top: 18, left: "50%", width: "100%", height: 3, background: passed ? T.accent3 : T.border, zIndex: 0 }} />
                  )}
                  {/* Node */}
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", zIndex: 1,
                    background: passed ? T.accent3 : isActive ? T.accent3 + "33" : T.card2,
                    border: `3px solid ${passed ? T.accent3 : isActive ? T.accent3 : T.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, transition: "all 0.3s",
                    boxShadow: isActive ? `0 0 12px ${T.accent3}66` : "none",
                  }}>
                    {passed ? "✓" : lvl.icon}
                  </div>
                  <div style={{ fontSize: 8, color: passed ? T.accent3 : isActive ? T.text : T.sub, marginTop: 4, textAlign: "center", letterSpacing: 0.5 }}>
                    {passed ? "PASSED" : isActive ? `${pct}%` : "LOCKED"}
                  </div>
                  <div style={{ fontSize: 8, color: T.sub, textAlign: "center" }}>Lv.{i + 1}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level cards */}
        {HORSE_STANCE_LEVELS.map((lvl, i) => {
          const key = `level_${i}`;
          const log = horseLog[key];
          const best = log?.best || 0;
          const passed = best >= lvl.duration;
          const isCurrentLevel = i === currentUnlockedLevel;
          const isLocked = i > currentUnlockedLevel;
          const pct = Math.min(100, Math.round((best / lvl.duration) * 100));
          const isTimerActive = activeHorse?.levelIdx === i;
          const accentCol = passed ? T.green : isCurrentLevel ? T.accent3 : T.sub;

          return (
            <div key={i} style={{ ...s.card, marginBottom: 14, border: `1px solid ${accentCol}44`, background: isTimerActive ? T.accent3 + "0a" : passed ? T.green + "07" : T.card, opacity: isLocked ? 0.45 : 1, pointerEvents: isLocked ? "none" : "auto" }}>

              {/* Level header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 20 }}>{lvl.icon}</span>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 2, color: accentCol }}>LEVEL {lvl.level} — {lvl.name}</div>
                    {passed && <span style={{ ...s.badge(T.green), fontSize: 10 }}>✓ PASSED</span>}
                    {isCurrentLevel && !passed && <span style={{ ...s.badge(T.accent3), fontSize: 10 }}>← CURRENT</span>}
                    {isLocked && <span style={{ ...s.badge(T.sub), fontSize: 10 }}>🔒 LOCKED</span>}
                  </div>
                  <div style={{ fontFamily: "'Rajdhani'", fontSize: 12, color: T.sub, letterSpacing: 1, marginTop: 2 }}>{lvl.chineseName} · Target: {lvl.duration}s · Weeks {lvl.targetWeeks}</div>
                </div>
                {best > 0 && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 18, color: passed ? T.green : T.accent3, lineHeight: 1 }}>🏆 {best}s</div>
                    <div style={{ fontSize: 9, color: T.sub, letterSpacing: 1 }}>BEST</div>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.sub, marginBottom: 3 }}>
                  <span>Progress to standard</span><span>{pct}% ({best}s / {lvl.duration}s)</span>
                </div>
                <div style={{ height: 6, background: T.border, borderRadius: 3 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${T.accent3}, ${passed ? T.green : T.accent3})`, borderRadius: 3, transition: "width 0.6s" }} />
                </div>
              </div>

              {/* Cue */}
              <div style={{ background: T.card2, borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: T.accent3, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>🥋 FORM & CUE</div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>{lvl.cue}</div>
              </div>

              {/* Standard */}
              <div style={{ background: accentCol + "11", border: `1px solid ${accentCol}33`, borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: accentCol, fontWeight: 700, letterSpacing: 2, marginBottom: 3 }}>🎯 PASS STANDARD</div>
                <div style={{ fontSize: 13, color: T.sub, lineHeight: 1.5 }}>{lvl.standard}</div>
              </div>

              {/* Mistakes */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: T.accent, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>⚠️ COMMON MISTAKES</div>
                {lvl.mistakes.map((m, mi) => (
                  <div key={mi} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                    <span style={{ color: T.accent, fontSize: 12, flexShrink: 0 }}>✗</span>
                    <span style={{ fontSize: 12, color: T.sub }}>{m}</span>
                  </div>
                ))}
              </div>

              {/* Recent sessions */}
              {log?.sessions?.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                  {log.sessions.slice(-5).map((sess, si) => (
                    <span key={si} style={{ ...s.badge(si === log.sessions.slice(-5).length - 1 ? accentCol : T.sub), fontSize: 10 }}>
                      {sess.date}: {sess.duration}s
                    </span>
                  ))}
                </div>
              )}

              {/* Timer controls */}
              {!isLocked && (
                isTimerActive ? (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 56, color: activeHorse.timer >= lvl.duration ? T.green : T.text, lineHeight: 1, marginBottom: 4, animation: activeHorse.timer >= lvl.duration ? "countPulse 0.6s infinite" : "none" }}>
                      {activeHorse.timer}s
                    </div>
                    <div style={{ fontSize: 11, color: T.sub, letterSpacing: 2, marginBottom: 12 }}>
                      {activeHorse.timer >= lvl.duration ? "🎉 TARGET REACHED — STOP WHEN READY" : `${lvl.duration - activeHorse.timer}s TO TARGET`}
                    </div>
                    <div style={{ height: 6, background: T.border, borderRadius: 3, marginBottom: 12 }}>
                      <div style={{ width: `${Math.min(100, (activeHorse.timer / lvl.duration) * 100)}%`, height: "100%", background: `linear-gradient(90deg, ${T.accent3}, ${T.green})`, borderRadius: 3, transition: "width 1s linear" }} />
                    </div>
                    <button onClick={() => stopHorseTimer(i)}
                      style={{ ...s.btn(T.accent, false), width: "100%", justifyContent: "center", fontSize: 15 }}>
                      ⏹ Stop & Save Time
                    </button>
                  </div>
                ) : (
                  <button onClick={() => startHorseTimer(i)}
                    style={{ ...s.btn(passed ? T.green : T.accent3, passed), width: "100%", justifyContent: "center", fontSize: 14, animation: isCurrentLevel && !passed ? "glow 2s infinite" : "none" }}>
                    {passed ? "▶ Practice Again" : best > 0 ? `▶ Resume Training (Best: ${best}s)` : "▶ Start Timer"}
                  </button>
                )
              )}
            </div>
          );
        })}

        {/* Neck workout retained */}
        <div style={{ marginTop: 8, marginBottom: 4 }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 32, letterSpacing: 4, color: T.accent2, lineHeight: 1 }}>NECK</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 3, color: T.sub, marginBottom: 12 }}>WORKOUT</div>
        </div>
        <div style={{ ...s.card, background: T.accent2 + "11", border: `1px solid ${T.accent2}44`, marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: T.sub, lineHeight: 1.7 }}>
            <strong style={{ color: T.accent2 }}>🏋️ Why train your neck?</strong> A strong neck absorbs punch impact, dramatically reducing knockdown risk. Train 2–3× per week. Start light — the neck is not used to direct loading. Stop immediately if you feel nerve or sharp pain.
          </div>
        </div>
        {(() => {
          const [neckSets, setNeckSets] = useState({});
          const [activeNeck, setActiveNeck] = useState(null);
          const neckRef = useRef(null);
          useEffect(() => {
            if (activeNeck?.running && activeNeck?.timer > 0) {
              neckRef.current = setInterval(() => setActiveNeck(a => a ? { ...a, timer: a.timer - 1 } : null), 1000);
            } else if (activeNeck?.timer === 0 && activeNeck?.running) {
              setActiveNeck(a => a ? { ...a, running: false } : null);
            }
            return () => clearInterval(neckRef.current);
          }, [activeNeck?.running, activeNeck?.timer]);

          return NECK_WORKOUT.map((ex, idx) => {
            const doneSets = neckSets[ex.id] || 0;
            const totalSets = ex.sets || 1;
            const complete = doneSets >= totalSets;
            const isActive = activeNeck?.idx === idx;
            return (
              <div key={ex.id} style={{ ...s.card, marginBottom: 10, border: `1px solid ${complete ? T.green : T.accent2}33`, background: complete ? T.green + "0a" : T.card }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{ex.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 17, letterSpacing: 2, color: complete ? T.green : T.text }}>{ex.name}</div>
                      {complete && <span style={{ ...s.badge(T.green), fontSize: 10 }}>✓ DONE</span>}
                    </div>
                    <div style={{ fontSize: 13, color: T.sub, lineHeight: 1.5, marginBottom: 6 }}>{ex.cue}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {ex.sets && <span style={{ ...s.badge(T.accent2) }}>{ex.sets} sets</span>}
                      {ex.reps && <span style={{ ...s.badge(T.accent3) }}>× {ex.reps} reps</span>}
                      {ex.duration && <span style={{ ...s.badge(T.accent3) }}>⏱ {fmt(ex.duration)}s</span>}
                      {doneSets > 0 && !complete && <span style={{ ...s.badge(T.accent) }}>{doneSets}/{totalSets} done</span>}
                    </div>
                  </div>
                </div>
                {isActive && ex.unit === "time" && (
                  <div style={{ background: dark ? "#0a0a18" : "#eef0ff", borderRadius: 10, padding: 12, marginBottom: 10, textAlign: "center" }}>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 44, color: activeNeck.timer < 5 ? T.accent : T.text, lineHeight: 1 }}>{fmt(activeNeck.timer)}</div>
                    <div style={{ height: 4, background: T.border, borderRadius: 2, marginTop: 8 }}>
                      <div style={{ height: "100%", width: `${((ex.duration - activeNeck.timer) / ex.duration) * 100}%`, background: `linear-gradient(90deg,${T.accent2},${T.green})`, borderRadius: 2, transition: "width 1s linear" }} />
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {ex.unit === "time" ? (
                    !isActive ? (
                      <button onClick={() => setActiveNeck({ idx, timer: ex.duration, running: false })}
                        style={{ ...s.btn(T.accent2, false), fontSize: 13, padding: "8px 16px" }}>▶ Start Timer</button>
                    ) : (
                      <>
                        <button onClick={() => { if (activeNeck.timer === 0) setActiveNeck(a => ({ ...a, timer: ex.duration, running: false })); else setActiveNeck(a => ({ ...a, running: !a.running })); }}
                          style={{ ...s.btn(activeNeck.running ? T.accent2 : T.green, false), fontSize: 13, padding: "8px 14px" }}>
                          {activeNeck.timer === 0 ? "↺ Redo" : activeNeck.running ? "⏸ Pause" : "▶ Start"}
                        </button>
                        {(activeNeck.timer === 0 || !activeNeck.running) && (
                          <button onClick={() => { setNeckSets(p => ({ ...p, [ex.id]: (p[ex.id] || 0) + 1 })); if ((doneSets + 1) >= totalSets) setActiveNeck(null); else setActiveNeck(a => ({ ...a, set: (a.set || 1) + 1, timer: ex.duration, running: false })); }}
                            style={{ ...s.btn(T.green, false), fontSize: 13, padding: "8px 14px" }}>
                            {doneSets + 1 >= totalSets ? "✓ Complete" : "Next Set →"}
                          </button>
                        )}
                        <button onClick={() => setActiveNeck(null)} style={{ ...s.btn(T.sub, true), fontSize: 13, padding: "8px 10px" }}>✕</button>
                      </>
                    )
                  ) : (
                    <button onClick={() => setNeckSets(p => ({ ...p, [ex.id]: (p[ex.id] || 0) + 1 }))} disabled={complete}
                      style={{ ...s.btn(complete ? T.sub : T.green, complete), fontSize: 13, padding: "8px 16px", opacity: complete ? 0.5 : 1 }}>
                      {complete ? "✓ All Sets Done" : `+ Log Set (${doneSets + 1}/${totalSets})`}
                    </button>
                  )}
                </div>
              </div>
            );
          });
        })()}
      </div>
    );
  };

  // ── PROGRESS SCREEN ──────────────────────────────────────────────────────────
  const ProgressScreen = () => {
    const tdee = calcTDEE(user);
    const bmiCat = user?.bmi ? getBMICategory(user.bmi) : null;
    const joinDate = user?.joinDate ? new Date(user.joinDate) : null;
    const daysSinceJoin = joinDate ? Math.max(1, Math.floor((Date.now() - joinDate) / 86400000)) : 1;
    const weeksIn = Math.ceil(daysSinceJoin / 7);
    const workoutsCompleted = Math.min(weeksIn * 6, daysSinceJoin); // ~6/week
    const expLevel = user?.experience || "beginner";

    // ── WEIGHT LOG ──
    const [weightLog, setWeightLog] = useState(() => {
      try { return JSON.parse(localStorage.getItem("ironfist_weightlog") || "[]"); } catch { return []; }
    });
    const [newWeight, setNewWeight] = useState("");
    const addWeightEntry = () => {
      const w = parseFloat(newWeight);
      if (!w || w < 30 || w > 300) return;
      const entry = { date: new Date().toLocaleDateString("en-GB"), weight: w, ts: Date.now() };
      const updated = [...weightLog, entry].slice(-30);
      setWeightLog(updated);
      try { localStorage.setItem("ironfist_weightlog", JSON.stringify(updated)); } catch { }
      setNewWeight("");
    };
    const weightStart = weightLog[0]?.weight || parseFloat(user?.weight) || null;
    const weightNow = weightLog[weightLog.length - 1]?.weight || parseFloat(user?.weight) || null;
    const weightDelta = weightStart && weightNow ? (weightNow - weightStart).toFixed(1) : null;
    const weightGoalDir = user?.goal === "lose fat" ? -1 : user?.goal === "build muscle" ? 1 : 0;

    // ── BODY STATS LOG ──
    const [bodyLog, setBodyLog] = useState(() => {
      try { return JSON.parse(localStorage.getItem("ironfist_bodylog") || "[]"); } catch { return []; }
    });
    const [bodyForm, setBodyForm] = useState({ chest: "", waist: "", hips: "", bicep: "", thigh: "" });
    const [showBodyForm, setShowBodyForm] = useState(false);
    const addBodyEntry = () => {
      const entry = { date: new Date().toLocaleDateString("en-GB"), ts: Date.now(), ...Object.fromEntries(Object.entries(bodyForm).filter(([, v]) => v)) };
      const updated = [...bodyLog, entry].slice(-12);
      setBodyLog(updated);
      try { localStorage.setItem("ironfist_bodylog", JSON.stringify(updated)); } catch { }
      setBodyForm({ chest: "", waist: "", hips: "", bicep: "", thigh: "" });
      setShowBodyForm(false);
    };
    const latestBody = bodyLog[bodyLog.length - 1] || {};
    const prevBody = bodyLog[bodyLog.length - 2] || {};

    // ── STRENGTH LOG ──
    const [strengthLog, setStrengthLog] = useState(() => {
      try { return JSON.parse(localStorage.getItem("ironfist_strengthlog") || "{}"); } catch { return {}; }
    });
    const [strForm, setStrForm] = useState({ exercise: "Pull-ups", value: "" });
    const addStrengthEntry = () => {
      if (!strForm.value) return;
      const key = strForm.exercise;
      const entry = { date: new Date().toLocaleDateString("en-GB"), value: parseFloat(strForm.value), ts: Date.now() };
      const updated = { ...strengthLog, [key]: [...(strengthLog[key] || []).slice(-10), entry] };
      setStrengthLog(updated);
      try { localStorage.setItem("ironfist_strengthlog", JSON.stringify(updated)); } catch { }
      setStrForm(f => ({ ...f, value: "" }));
    };

    // ── COMBO MASTERY ──
    const [comboLog, setComboLog] = useState(() => {
      try { return JSON.parse(localStorage.getItem("ironfist_combolog") || "{}"); } catch { return {}; }
    });
    const combos = [
      "Jab → Cross", "Jab → Cross → Hook", "Double Jab → Cross",
      "Jab → Cross → Hook → Cross", "Slip → Cross → Hook", "Body Jab → Cross → Head Hook",
    ];
    const setComboMastery = (combo, val) => {
      const updated = { ...comboLog, [combo]: parseInt(val) };
      setComboLog(updated);
      try { localStorage.setItem("ironfist_combolog", JSON.stringify(updated)); } catch { };
    };

    // ── WORKOUT STREAK ──
    const [workoutDays, setWorkoutDays] = useState(() => {
      try { return JSON.parse(localStorage.getItem("ironfist_workoutdays") || "[]"); } catch { return []; }
    });
    const logTodayWorkout = () => {
      const today = new Date().toLocaleDateString("en-GB");
      if (workoutDays.includes(today)) return;
      const updated = [...workoutDays, today].slice(-60);
      setWorkoutDays(updated);
      try { localStorage.setItem("ironfist_workoutdays", JSON.stringify(updated)); } catch { };
    };
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return workoutDays.includes(d.toLocaleDateString("en-GB"));
    });
    const currentStreak = (() => {
      let s = 0;
      for (let i = workoutDays.length - 1; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - s);
        if (workoutDays[i] === d.toLocaleDateString("en-GB")) s++;
        else break;
      }
      return s;
    })();

    // ── FITNESS AGE ESTIMATE ──
    const fitnessAge = (() => {
      if (!user?.age) return null;
      const age = parseInt(user.age);
      const bmi = parseFloat(user.bmi);
      let bonus = 0;
      if (expLevel === "intermediate") bonus = -2;
      if (expLevel === "advanced") bonus = -5;
      if (bmi && bmi < 25) bonus -= 1;
      if (bmi && bmi > 30) bonus += 3;
      return Math.max(16, age + bonus);
    })();

    // ── PROGRESS SCORE ──
    const progressScore = Math.min(100, Math.round(
      (currentStreak * 3) +
      (weightLog.length * 5) +
      (bodyLog.length * 8) +
      (Object.keys(strengthLog).length * 6) +
      (Object.keys(comboLog).length * 4)
    ));

    const SectionTitle = ({ children, color }) => (
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 3, color: color || T.accent3, marginBottom: 12, paddingBottom: 6, borderBottom: `2px solid ${color || T.accent3}44` }}>{children}</div>
    );

    const Delta = ({ val, unit, good }) => {
      if (val === null || val === undefined) return null;
      const n = parseFloat(val);
      const isGood = good === "up" ? n >= 0 : n <= 0;
      const color = n === 0 ? T.sub : isGood ? T.green : T.accent;
      return <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color }}>{n > 0 ? "+" : ""}{val}{unit}</span>;
    };

    return (
      <div style={{ padding: 16 }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 38, letterSpacing: 4, color: T.accent3, marginBottom: 4 }}>PROGRESS</div>
        <div style={{ fontSize: 12, color: T.sub, letterSpacing: 2, marginBottom: 20 }}>TRACKING YOUR FIGHTER EVOLUTION</div>

        {/* ── OVERALL SCORE ── */}
        <div style={{ ...s.card, background: `linear-gradient(135deg, ${T.accent3}18, ${T.card})`, border: `1px solid ${T.accent3}44`, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
              <svg width="100" height="100" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke={T.border} strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={T.accent3} strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - progressScore / 100)}
                  style={{ transition: "stroke-dashoffset 1s ease" }} />
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 22, color: T.accent3, lineHeight: 1 }}>{progressScore}</div>
                <div style={{ fontSize: 8, color: T.sub, letterSpacing: 1 }}>SCORE</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: T.text, letterSpacing: 2 }}>FIGHTER PROFILE</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
                {[
                  { label: "Training Days", val: workoutDays.length, color: T.accent },
                  { label: "Week", val: `Wk ${weekNumber}`, color: T.accent2 },
                  { label: "Streak", val: `${currentStreak}d 🔥`, color: T.green },
                  { label: "Fitness Age", val: fitnessAge ? `${fitnessAge}yr` : "—", color: T.accent3 },
                ].map((st, i) => (
                  <div key={i} style={{ background: T.card2, borderRadius: 8, padding: "6px 10px" }}>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 15, color: st.color }}>{st.val}</div>
                    <div style={{ fontSize: 9, color: T.sub, letterSpacing: 1 }}>{st.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.sub, marginBottom: 4 }}>
              <span>PROGRESS SCORE</span><span>{progressScore}/100</span>
            </div>
            <div style={{ height: 8, background: T.border, borderRadius: 4 }}>
              <div style={{ width: `${progressScore}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${T.accent}, ${T.accent3})`, transition: "width 1s ease" }} />
            </div>
            <div style={{ fontSize: 10, color: T.sub, marginTop: 4 }}>Log workouts, weight, body measurements & combo mastery to raise your score</div>
          </div>
        </div>

        {/* ── WEEKLY ACTIVITY HEATMAP ── */}
        <div style={{ ...s.card, marginBottom: 16 }}>
          <SectionTitle color={T.accent}>📅 WEEKLY ACTIVITY</SectionTitle>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {last7.map((done, i) => {
              const d = new Date(); d.setDate(d.getDate() - (6 - i));
              const isToday = i === 6;
              return (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ height: 48, background: done ? T.accent : isToday ? T.border : T.card2, borderRadius: 8, border: `2px solid ${done ? T.accent : isToday ? T.accent + "44" : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: done ? 20 : 14, color: done ? "#fff" : T.sub, transition: "all 0.3s" }}>
                    {done ? "🥊" : isToday ? "⬤" : "·"}
                  </div>
                  <div style={{ fontSize: 9, color: isToday ? T.accent : T.sub, marginTop: 4, letterSpacing: 1 }}>{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][(d.getDay())]}</div>
                </div>
              );
            })}
          </div>
          <button onClick={logTodayWorkout} style={{ ...s.btn(workoutDays.includes(new Date().toLocaleDateString("en-GB")) ? T.green : T.accent, workoutDays.includes(new Date().toLocaleDateString("en-GB"))), width: "100%", justifyContent: "center", fontSize: 14 }}>
            {workoutDays.includes(new Date().toLocaleDateString("en-GB")) ? "✓ Today Logged" : "🥊 Log Today's Workout"}
          </button>
        </div>

        {/* ── PROGRESS GRAPH (Trading-style) ── */}
        {(() => {
          // Build daily progress score history — one data point per workout day
          // Score increases based on: streak continuity, total days, week number, logs
          const allDays = [...workoutDays].sort();
          const scoreHistory = allDays.map((d, idx) => {
            const streakAtDay = (() => {
              let s = 0;
              for (let j = idx; j >= 0; j--) {
                const prev = new Date(allDays[j].split("/").reverse().join("-"));
                const expected = new Date(allDays[idx].split("/").reverse().join("-"));
                expected.setDate(expected.getDate() - (idx - j));
                if (allDays[j] === expected.toLocaleDateString("en-GB")) s++;
                else break;
              }
              return s;
            })();
            const base = (idx + 1) * 3;
            const streakBonus = Math.min(streakAtDay * 2, 30);
            const logBonus = Math.floor(idx * 0.5);
            return { date: d, score: Math.min(100, base + streakBonus + logBonus) };
          });

          if (scoreHistory.length < 2) return (
            <div style={{ ...s.card, marginBottom: 16 }}>
              <SectionTitle color={T.green}>📈 PROGRESS CHART</SectionTitle>
              <div style={{ textAlign: "center", padding: "24px 16px", color: T.sub, fontSize: 13 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
                Complete at least 2 workouts to see your progress chart. Every session adds a new data point!
              </div>
            </div>
          );

          const W = 320, H = 120, PAD = 16;
          const minS = Math.max(0, Math.min(...scoreHistory.map(x => x.score)) - 5);
          const maxS = Math.min(100, Math.max(...scoreHistory.map(x => x.score)) + 5);
          const range = maxS - minS || 1;
          const pts = scoreHistory.map((p, i) => ({
            x: PAD + (i / (scoreHistory.length - 1)) * (W - PAD * 2),
            y: H - PAD - ((p.score - minS) / range) * (H - PAD * 2),
            ...p,
          }));

          const pathD = pts.map((p, i) => {
            if (i === 0) return `M ${p.x} ${p.y}`;
            const prev = pts[i - 1];
            const cpx = (prev.x + p.x) / 2;
            return `C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
          }).join(" ");

          const areaD = pathD + ` L ${pts[pts.length - 1].x} ${H - PAD} L ${pts[0].x} ${H - PAD} Z`;

          const latest = scoreHistory[scoreHistory.length - 1];
          const prev = scoreHistory[scoreHistory.length - 2];
          const delta = latest.score - prev.score;
          const trendUp = delta >= 0;

          // Find best/worst streaks for annotation
          const peak = scoreHistory.reduce((a, b) => a.score > b.score ? a : b);

          return (
            <div style={{ ...s.card, marginBottom: 16, background: `linear-gradient(135deg, ${T.green}0a, ${T.card})`, border: `1px solid ${T.green}33` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <SectionTitle color={T.green}>📈 TRAINING PROGRESS</SectionTitle>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 22, color: trendUp ? T.green : T.accent, lineHeight: 1 }}>
                    {trendUp ? "▲" : "▼"} {Math.abs(delta).toFixed(0)}
                  </div>
                  <div style={{ fontSize: 10, color: T.sub, letterSpacing: 1 }}>vs last session</div>
                </div>
              </div>

              {/* Mini stats row */}
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Current", val: latest.score.toFixed(0), color: T.green },
                  { label: "Peak", val: peak.score.toFixed(0), color: T.accent2 },
                  { label: "Sessions", val: scoreHistory.length, color: T.accent3 },
                  { label: "Trend", val: trendUp ? "↑ UP" : "↓ DOWN", color: trendUp ? T.green : T.accent },
                ].map((st, i) => (
                  <div key={i} style={{ flex: 1, background: T.card2, borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, color: st.color, lineHeight: 1 }}>{st.val}</div>
                    <div style={{ fontSize: 9, color: T.sub, letterSpacing: 1, marginTop: 3 }}>{st.label}</div>
                  </div>
                ))}
              </div>

              {/* SVG chart */}
              <div style={{ overflowX: "auto" }}>
                <svg width={Math.max(W, scoreHistory.length * 28)} height={H + 20} style={{ display: "block" }}
                  viewBox={`0 0 ${Math.max(W, scoreHistory.length * 28)} ${H + 20}`}>
                  <defs>
                    <linearGradient id="progGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.green} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={T.green} stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[25, 50, 75, 100].map(g => {
                    const gy = H - PAD - ((g - minS) / range) * (H - PAD * 2);
                    if (gy < PAD || gy > H - PAD) return null;
                    return (
                      <g key={g}>
                        <line x1={PAD} y1={gy} x2={W - PAD} y2={gy} stroke={T.border} strokeWidth="1" strokeDasharray="3 4" />
                        <text x={PAD - 2} y={gy + 4} fontSize="8" fill={T.sub} textAnchor="end">{g}</text>
                      </g>
                    );
                  })}
                  {/* Area fill */}
                  <path d={areaD} fill="url(#progGrad)" />
                  {/* Line */}
                  <path d={pathD} fill="none" stroke={T.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Data points */}
                  {pts.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r={i === pts.length - 1 ? 6 : 4}
                        fill={i === pts.length - 1 ? T.green : T.card}
                        stroke={T.green} strokeWidth="2" />
                      {/* Latest point glow */}
                      {i === pts.length - 1 && (
                        <circle cx={p.x} cy={p.y} r="10" fill={T.green} opacity="0.15" />
                      )}
                    </g>
                  ))}
                  {/* Peak annotation */}
                  {(() => {
                    const peakPt = pts.reduce((a, b) => a.score > b.score ? a : b);
                    return (
                      <g>
                        <line x1={peakPt.x} y1={peakPt.y - 6} x2={peakPt.x} y2={peakPt.y - 18} stroke={T.accent2} strokeWidth="1.5" strokeDasharray="2 2" />
                        <text x={peakPt.x} y={peakPt.y - 22} fontSize="9" fill={T.accent2} textAnchor="middle">PEAK</text>
                      </g>
                    );
                  })()}
                  {/* X axis date labels */}
                  {pts.filter((_, i) => i === 0 || i === pts.length - 1 || (pts.length > 7 && i % Math.floor(pts.length / 4) === 0)).map((p, i) => (
                    <text key={i} x={p.x} y={H + 16} fontSize="8" fill={T.sub} textAnchor="middle">{p.date.slice(0, 5)}</text>
                  ))}
                </svg>
              </div>

              <div style={{ fontSize: 11, color: T.sub, marginTop: 6, textAlign: "center" }}>
                Score grows with consistent training, streaks, and logging. Keep going! 💪
              </div>
            </div>
          );
        })()}

        {/* ── WEIGHT TRACKER ── */}
        <div style={{ ...s.card, marginBottom: 16 }}>
          <SectionTitle color={T.accent2}>⚖️ WEIGHT TRACKER</SectionTitle>
          <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            {[
              { label: "Start", val: weightStart ? `${weightStart}kg` : "—", color: T.sub },
              { label: "Current", val: weightNow ? `${weightNow}kg` : "—", color: T.accent2 },
              { label: "Change", val: weightDelta !== null ? <Delta val={weightDelta} unit="kg" good={weightGoalDir === 1 ? "up" : weightGoalDir === -1 ? "down" : "flat"} /> : "—", color: T.text },
              { label: "Target", val: user?.weight && user?.goal === "lose fat" ? `${Math.round(parseFloat(user.weight) * 0.9)}kg` : user?.weight && user?.goal === "build muscle" ? `${Math.round(parseFloat(user.weight) * 1.05)}kg` : "—", color: T.green },
            ].map((st, i) => (
              <div key={i} style={{ ...s.card, background: T.card2, padding: "10px 14px", flex: 1, minWidth: 70, textAlign: "center" }}>
                <div style={{ fontSize: 16, color: st.color, fontFamily: "'JetBrains Mono'", lineHeight: 1 }}>{st.val}</div>
                <div style={{ fontSize: 9, color: T.sub, letterSpacing: 1, marginTop: 3 }}>{st.label}</div>
              </div>
            ))}
          </div>

          {/* Mini weight chart */}
          {weightLog.length > 1 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: T.sub, letterSpacing: 2, marginBottom: 6 }}>TREND (last {Math.min(weightLog.length, 14)} entries)</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 64 }}>
                {weightLog.slice(-14).map((e, i) => {
                  const min = Math.min(...weightLog.slice(-14).map(x => x.weight));
                  const max = Math.max(...weightLog.slice(-14).map(x => x.weight));
                  const pct = max === min ? 50 : ((e.weight - min) / (max - min)) * 80 + 10;
                  return (
                    <div key={i} title={`${e.date}: ${e.weight}kg`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                      <div style={{ width: "100%", height: `${pct}%`, background: i === weightLog.slice(-14).length - 1 ? T.accent2 : T.accent2 + "66", borderRadius: "3px 3px 0 0", transition: "height 0.5s" }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: T.sub, marginTop: 2 }}>
                <span>{weightLog.slice(-14)[0]?.date}</span>
                <span>{weightLog[weightLog.length - 1]?.date}</span>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <input type="number" value={newWeight} onChange={e => setNewWeight(e.target.value)} placeholder="Weight in kg" style={{ ...s.input, flex: 1, marginBottom: 0 }} />
            <button onClick={addWeightEntry} style={{ ...s.btn(T.accent2, false), padding: "10px 16px", whiteSpace: "nowrap" }}>+ Log</button>
          </div>
          {weightLog.length > 0 && (
            <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {weightLog.slice(-5).map((e, i) => (
                <div key={i} style={{ ...s.badge(T.sub), fontSize: 11 }}>{e.date}: {e.weight}kg</div>
              ))}
            </div>
          )}
        </div>

        {/* ── BODY MEASUREMENTS ── */}
        <div style={{ ...s.card, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <SectionTitle color={T.accent3}>📏 BODY MEASUREMENTS</SectionTitle>
            <button onClick={() => setShowBodyForm(f => !f)} style={{ ...s.btn(T.accent3, true), padding: "6px 12px", fontSize: 12, marginBottom: 12 }}>{showBodyForm ? "✕" : "+ Log"}</button>
          </div>

          {showBodyForm && (
            <div style={{ background: T.card2, borderRadius: 10, padding: 14, marginBottom: 14, animation: "slideUp 0.3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                {[["chest", "Chest (cm)"], ["waist", "Waist (cm)"], ["hips", "Hips (cm)"], ["bicep", "Bicep (cm)"], ["thigh", "Thigh (cm)"]].map(([k, lbl]) => (
                  <div key={k}>
                    <label style={{ ...s.label, marginBottom: 3 }}>{lbl}</label>
                    <input type="number" value={bodyForm[k]} onChange={e => setBodyForm(f => ({ ...f, [k]: e.target.value }))} placeholder="—" style={{ ...s.input, marginBottom: 0 }} />
                  </div>
                ))}
              </div>
              <button onClick={addBodyEntry} style={{ ...s.btn(T.accent3, false), width: "100%", justifyContent: "center" }}>✓ Save Measurements</button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[["Chest", "chest", "📦"], ["Waist", "waist", "〰️"], ["Hips", "hips", "🍑"], ["Bicep", "bicep", "💪"], ["Thigh", "thigh", "🦵"]].map(([lbl, k, icon]) => {
              const curr = latestBody[k];
              const prev = prevBody[k];
              const delta = curr && prev ? (parseFloat(curr) - parseFloat(prev)).toFixed(1) : null;
              return (
                <div key={k} style={{ background: T.card2, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 18, color: curr ? T.accent3 : T.sub }}>{curr ? `${curr}cm` : "—"}</div>
                  <div style={{ fontSize: 9, color: T.sub, letterSpacing: 1 }}>{lbl}</div>
                  {delta !== null && <div style={{ marginTop: 4 }}><Delta val={delta} unit="cm" good={k === "waist" ? "down" : "up"} /></div>}
                </div>
              );
            })}
          </div>
          {bodyLog.length > 0 && <div style={{ fontSize: 11, color: T.sub, marginTop: 8 }}>Last measured: {latestBody.date} · {bodyLog.length} sessions logged</div>}
        </div>

        {/* ── BMI & BODY COMPOSITION ── */}
        <div style={{ ...s.card, marginBottom: 16 }}>
          <SectionTitle color={T.green}>🏋️ BODY COMPOSITION</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[
              { label: "BMI", val: user?.bmi || "—", color: bmiCat?.color || T.sub, sub: bmiCat?.label || "—" },
              { label: "Weight", val: user?.weight ? `${user.weight}kg` : "—", color: T.accent2, sub: "Current" },
              { label: "Height", val: user?.height ? `${user.height}cm` : "—", color: T.accent3, sub: "Standing" },
            ].map((st, i) => (
              <div key={i} style={{ background: T.card2, borderRadius: 10, padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 26, color: st.color, lineHeight: 1 }}>{st.val}</div>
                <div style={{ fontSize: 9, color: T.sub, letterSpacing: 1, marginTop: 3 }}>{st.label}</div>
                <div style={{ fontSize: 10, color: st.color, marginTop: 2 }}>{st.sub}</div>
              </div>
            ))}
          </div>

          {/* BMI scale */}
          {user?.bmi && (
            <div>
              <div style={{ fontSize: 11, color: T.sub, letterSpacing: 2, marginBottom: 6 }}>BMI SCALE</div>
              <div style={{ position: "relative", height: 14, borderRadius: 7, background: `linear-gradient(90deg, #3b82f6 0%, #22c55e 25%, #f5a623 50%, #e8392a 75%, #9333ea 100%)`, marginBottom: 6 }}>
                <div style={{ position: "absolute", top: -2, width: 18, height: 18, borderRadius: "50%", background: "#fff", border: `3px solid ${bmiCat?.color}`, transform: "translateX(-50%)", left: `${Math.min(Math.max(((parseFloat(user.bmi) - 15) / 25) * 100, 2), 98)}%`, transition: "left 0.8s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: T.sub }}>
                <span>Underweight &lt;18.5</span><span>Normal 18.5–25</span><span>Overweight 25–30</span><span>Obese 30+</span>
              </div>
            </div>
          )}
        </div>

        {/* ── STRENGTH LOG ── */}
        <div style={{ ...s.card, marginBottom: 16 }}>
          <SectionTitle color={T.accent}>🏆 STRENGTH LOG (Personal Records)</SectionTitle>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <select value={strForm.exercise} onChange={e => setStrForm(f => ({ ...f, exercise: e.target.value }))}
              style={{ ...s.input, flex: 2, marginBottom: 0, minWidth: 140 }}>
              {["Pull-ups", "Push-ups", "Squats", "Plank (sec)", "Dead Hang (sec)", "Burpees", "Wide Grip Pull-ups", "Chin-ups"].map(ex => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
            <input type="number" value={strForm.value} onChange={e => setStrForm(f => ({ ...f, value: e.target.value }))} placeholder="Reps / sec" style={{ ...s.input, flex: 1, marginBottom: 0, minWidth: 80 }} />
            <button onClick={addStrengthEntry} style={{ ...s.btn(T.accent, false), padding: "10px 14px" }}>+ PR</button>
          </div>
          {Object.keys(strengthLog).length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px", color: T.sub, fontSize: 13 }}>No PRs logged yet — log your first rep count above! 💪</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(strengthLog).map(([ex, entries]) => {
                const best = Math.max(...entries.map(e => e.value));
                const latest = entries[entries.length - 1]?.value;
                const prev = entries[entries.length - 2]?.value;
                const delta = prev ? (latest - prev).toFixed(0) : null;
                const pct = Math.min((best / { "Pull-ups": 30, "Push-ups": 100, "Squats": 200, "Plank (sec)": 300, "Dead Hang (sec)": 120, "Burpees": 50, "Wide Grip Pull-ups": 25, "Chin-ups": 25 }[ex] || 50) * 100, 100);
                return (
                  <div key={ex}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{ex}</div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        {delta !== null && <Delta val={delta} unit="" good="up" />}
                        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 15, color: T.accent }}>🏆 {best}</span>
                      </div>
                    </div>
                    <div style={{ height: 8, background: T.border, borderRadius: 4 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${T.accent}, ${T.green})`, borderRadius: 4, transition: "width 0.8s" }} />
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                      {entries.slice(-6).map((e, i) => (
                        <div key={i} style={{ ...s.badge(i === entries.slice(-6).length - 1 ? T.accent : T.sub), fontSize: 10 }}>{e.date}: {e.value}</div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── COMBO MASTERY ── */}
        <div style={{ ...s.card, marginBottom: 16 }}>
          <SectionTitle color={T.accent2}>🥊 BOXING COMBO MASTERY</SectionTitle>
          <div style={{ fontSize: 12, color: T.sub, marginBottom: 12 }}>Rate your mastery for each combination (0–100%)</div>
          {combos.map((combo, i) => {
            const val = comboLog[combo] || 0;
            const color = val >= 80 ? T.green : val >= 50 ? T.accent2 : T.accent;
            return (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{combo}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color }}>{val}%</span>
                    {val >= 80 && <span style={s.badge(T.green)}>✓ Mastered</span>}
                  </div>
                </div>
                <input type="range" min="0" max="100" step="5" value={val}
                  onChange={e => setComboMastery(combo, e.target.value)}
                  style={{ width: "100%", accentColor: color, cursor: "pointer" }} />
                <div style={{ height: 6, background: T.border, borderRadius: 3, marginTop: 4 }}>
                  <div style={{ width: `${val}%`, height: "100%", background: `linear-gradient(90deg, ${T.accent}, ${color})`, borderRadius: 3, transition: "width 0.3s" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CALORIE BALANCE ── */}
        {tdee && (
          <div style={{ ...s.card, marginBottom: 16, background: `linear-gradient(135deg, ${T.accent2}0a, ${T.card})`, border: `1px solid ${T.accent2}33` }}>
            <SectionTitle color={T.accent2}>🔥 CALORIE BALANCE</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
              {[
                { label: "BMR", val: tdee.bmr, color: T.sub },
                { label: "TDEE", val: tdee.tdee, color: T.accent2 },
                { label: "Target", val: tdee.target, color: T.green },
              ].map((st, i) => (
                <div key={i} style={{ background: T.card2, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 17, color: st.color }}>{st.val}</div>
                  <div style={{ fontSize: 9, color: T.sub, letterSpacing: 1 }}>{st.label} kcal</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.sub }}>
              <span>{user?.goal === "lose fat" ? "−18% calorie deficit" : user?.goal === "build muscle" ? "+10% calorie surplus" : "Maintenance calories"}</span>
              <span style={{ color: T.accent2, fontWeight: 700 }}>{tdee.protein}g P · {tdee.carbs}g C · {tdee.fat}g F</span>
            </div>
          </div>
        )}

        {/* ── MILESTONES ── */}
        <div style={{ ...s.card }}>
          <SectionTitle color={T.green}>🎖️ MILESTONES</SectionTitle>
          {[
            { label: "First Workout Logged", done: workoutDays.length >= 1, icon: "🥊" },
            { label: "7-Day Streak", done: currentStreak >= 7, icon: "🔥" },
            { label: "30-Day Streak", done: currentStreak >= 30, icon: "💎" },
            { label: "Logged Weight 5× Times", done: weightLog.length >= 5, icon: "⚖️" },
            { label: "Logged Body Measurements", done: bodyLog.length >= 1, icon: "📏" },
            { label: "3 Combo Masteries > 80%", done: Object.values(comboLog).filter(v => v >= 80).length >= 3, icon: "🎯" },
            { label: "5 PRs Logged", done: Object.keys(strengthLog).length >= 5, icon: "🏆" },
            { label: "Reached Week 4", done: weekNumber >= 4, icon: "📅" },
          ].map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}22` }}>
              <div style={{ fontSize: 22, width: 32, textAlign: "center" }}>{m.icon}</div>
              <div style={{ flex: 1, fontSize: 14, color: m.done ? T.text : T.sub }}>{m.label}</div>
              <div style={{ fontSize: 18 }}>{m.done ? "✅" : "⬜"}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── GOOGLE COMPLETION MODAL ─────────────────────────────────────────────────
  // Shows after Google sign-in to collect body stats + intensity
  const GoogleCompletionModal = () => {
    const [gForm, setGForm] = useState({
      gender: "male", age: "", height: "", weight: "",
      goal: "improve performance", experience: "beginner",
    });
    const bmi = gForm.height && gForm.weight ? calcBMI(gForm.weight, gForm.height) : null;
    const bmiCat = bmi ? getBMICategory(bmi) : null;

    const finishGoogleSetup = () => {
      const finalBmi = bmi;
      loginUser({
        ...googlePending,
        ...gForm,
        bmi: finalBmi,
        joinDate: new Date().toISOString(),
      });
      setGooglePending(null);
    };

    return (
      <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ ...s.card, maxWidth: 440, width: "100%", padding: 28, maxHeight: "90vh", overflowY: "auto" }}>
          {/* Avatar + name */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            {googlePending?.googleAvatar && (
              <img src={googlePending.googleAvatar} alt="avatar" style={{ width: 64, height: 64, borderRadius: "50%", marginBottom: 10, border: `3px solid ${T.accent}` }} />
            )}
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 3, color: T.text }}>
              WELCOME, {googlePending?.name?.toUpperCase()}!
            </div>
            <div style={{ fontSize: 13, color: T.sub, marginTop: 4 }}>
              Complete your fighter profile to personalise your training
            </div>
          </div>

          {/* Body stats */}
          <div style={{ ...s.card, background: T.card2, marginBottom: 16 }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 16, letterSpacing: 2, color: T.accent2, marginBottom: 14 }}>YOUR BODY</div>
            <label style={s.label}>Gender</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {["male", "female", "other"].map(g => (
                <button key={g} onClick={() => setGForm(f => ({ ...f, gender: g }))}
                  style={{ ...s.btn(gForm.gender === g ? T.accent : T.sub, gForm.gender !== g), flex: 1, justifyContent: "center", padding: "9px 4px", fontSize: 12 }}>
                  {g === "male" ? "♂ Male" : g === "female" ? "♀ Female" : "⚧ Other"}
                </button>
              ))}
            </div>
            <label style={s.label}>Age</label>
            <input style={s.input} type="number" placeholder="Years" value={gForm.age} onChange={e => setGForm(f => ({ ...f, age: e.target.value }))} />
            <label style={s.label}>Height (cm)</label>
            <input style={s.input} type="number" placeholder="e.g. 175" value={gForm.height} onChange={e => setGForm(f => ({ ...f, height: e.target.value }))} />
            <label style={s.label}>Weight (kg)</label>
            <input style={s.input} type="number" placeholder="e.g. 75" value={gForm.weight} onChange={e => setGForm(f => ({ ...f, weight: e.target.value }))} />
            {bmi && bmiCat && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: bmiCat.color + "18", border: `1px solid ${bmiCat.color}44`, borderRadius: 10, padding: "10px 14px", marginTop: 4 }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 28, color: bmiCat.color, lineHeight: 1 }}>{bmi}</div>
                  <div style={{ fontSize: 10, color: T.sub, letterSpacing: 2 }}>BMI</div>
                </div>
                <div style={{ ...s.badge(bmiCat.color), fontSize: 13 }}>{bmiCat.label}</div>
              </div>
            )}
          </div>

          {/* Goal + Intensity */}
          <div style={{ ...s.card, background: T.card2, marginBottom: 20 }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 16, letterSpacing: 2, color: T.accent, marginBottom: 14 }}>YOUR MISSION</div>
            <label style={s.label}>Primary Goal</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {[["lose fat", "🔥 Lose Fat"], ["build muscle", "💪 Build Muscle"], ["improve performance", "⚡ Improve Performance"]].map(([val, lbl]) => (
                <button key={val} onClick={() => setGForm(f => ({ ...f, goal: val }))}
                  style={{ ...s.btn(gForm.goal === val ? T.accent : T.sub, gForm.goal !== val), justifyContent: "flex-start", fontSize: 14 }}>
                  {gForm.goal === val ? "✓ " : ""}{lbl}
                </button>
              ))}
            </div>
            <label style={s.label}>Training Intensity Level</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[["beginner", "🟢", "New to boxing"], ["intermediate", "🟡", "6–12 months"], ["advanced", "🔴", "1+ year"]].map(([val, dot, sub]) => (
                <button key={val} onClick={() => setGForm(f => ({ ...f, experience: val }))}
                  style={{ ...s.btn(gForm.experience === val ? T.accent2 : T.sub, gForm.experience !== val), flex: 1, flexDirection: "column", alignItems: "center", padding: "10px 6px", gap: 4, fontSize: 12 }}>
                  <span style={{ fontSize: 18 }}>{dot}</span>
                  <span style={{ textTransform: "capitalize", fontWeight: 700 }}>{val}</span>
                  <span style={{ fontSize: 10, color: gForm.experience === val ? "#fff" : T.sub, fontWeight: 400 }}>{sub}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={finishGoogleSetup}
            disabled={!gForm.age || !gForm.height || !gForm.weight}
            style={{ ...s.btn(T.green, false), width: "100%", justifyContent: "center", fontSize: 16, opacity: (!gForm.age || !gForm.height || !gForm.weight) ? 0.45 : 1 }}>
            🥊 Enter Iron Fist
          </button>
          <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: T.sub }}>
            All fields required for accurate calorie & intensity calculations
          </div>
        </div>
      </div>
    );
  };

  // ── PROFILE SCREEN ──────────────────────────────────────────────────────────
  const ProfileScreen = () => {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
      name: user?.name || "",
      email: user?.email || "",
      gender: user?.gender || "male",
      age: user?.age || "",
      height: user?.height || "",
      weight: user?.weight || "",
      goal: user?.goal || "improve performance",
      experience: user?.experience || "beginner",
    });

    const liveBmi = form.height && form.weight ? calcBMI(form.weight, form.height) : null;
    const liveBmiCat = liveBmi ? getBMICategory(liveBmi) : null;
    const tdee = calcTDEE(editing ? { ...user, ...form } : user);

    const save = () => {
      updateUser({ ...form });
      setEditing(false);
    };

    const Field = ({ label, children }) => (
      <div style={{ marginBottom: 14 }}>
        <label style={s.label}>{label}</label>
        {children}
      </div>
    );

    const StatBox = ({ value, label, color }) => (
      <div style={{ ...s.card, background: T.card2, textAlign: "center", padding: "14px 8px" }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: color || T.accent, lineHeight: 1 }}>{value ?? "—"}</div>
        <div style={{ fontSize: 10, color: T.sub, letterSpacing: 2, marginTop: 3 }}>{label}</div>
      </div>
    );

    return (
      <div style={{ padding: 16 }}>
        {/* Header */}
        <div style={{ ...s.card, background: `linear-gradient(135deg, ${T.accent}22, ${T.card})`, border: `1px solid ${T.accent}44`, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.accent + "22", border: `2px solid ${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
              {user?.googleAvatar
                ? <img src={user.googleAvatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 28 }}>🥊</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: 2, color: T.text, lineHeight: 1 }}>{user?.name || "Fighter"}</div>
              <div style={{ fontSize: 13, color: T.sub, marginTop: 2 }}>{user?.email}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                <span style={s.badge(T.accent)}>{user?.goal?.toUpperCase() || "PERFORMANCE"}</span>
                <span style={s.badge(T.accent2)}>{user?.experience?.toUpperCase() || "BEGINNER"}</span>
              </div>
            </div>
            <button onClick={() => setEditing(e => !e)} style={{ ...s.btn(editing ? T.sub : T.accent, editing), padding: "8px 14px", fontSize: 13 }}>
              {editing ? "✕ Cancel" : "✏️ Edit"}
            </button>
          </div>

          {/* Member since */}
          {user?.joinDate && (
            <div style={{ marginTop: 12, fontSize: 12, color: T.sub, letterSpacing: 1 }}>
              Member since {new Date(user.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              {user?.googleSub ? " · Google Account" : " · Manual Registration"}
            </div>
          )}
        </div>

        {/* ── CALORIE & MACRO DASHBOARD ── */}
        {tdee ? (
          <div style={{ ...s.card, marginBottom: 16, background: `linear-gradient(135deg, ${T.accent2}15, ${T.card})`, border: `1px solid ${T.accent2}44` }}>
            <div style={s.sectionTitle}>🔥 DAILY CALORIE TARGET</div>

            {/* Main calorie ring display */}
            <div style={{ display: "flex", align: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
                <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="65" cy="65" r="55" fill="none" stroke={T.border} strokeWidth="10" />
                  <circle cx="65" cy="65" r="55" fill="none" stroke={T.accent2} strokeWidth="10"
                    strokeLinecap="round" strokeDasharray={2 * Math.PI * 55}
                    strokeDashoffset={2 * Math.PI * 55 * (1 - Math.min(tdee.target / 4000, 1))} />
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 22, color: T.accent2, lineHeight: 1 }}>{tdee.target}</div>
                  <div style={{ fontSize: 9, color: T.sub, letterSpacing: 1 }}>KCAL/DAY</div>
                </div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: T.sub }}>Basal (BMR)</span>
                  <span style={{ fontFamily: "'JetBrains Mono'", color: T.text }}>{tdee.bmr} kcal</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: T.sub }}>Maintenance (TDEE)</span>
                  <span style={{ fontFamily: "'JetBrains Mono'", color: T.text }}>{tdee.tdee} kcal</span>
                </div>
                <div style={{ height: 1, background: T.border }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700 }}>
                  <span style={{ color: T.accent2 }}>
                    {user?.goal === "lose fat" ? "🔥 Fat Loss Target" : user?.goal === "build muscle" ? "💪 Muscle Gain Target" : "⚡ Performance Target"}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono'", color: T.accent2 }}>{tdee.target} kcal</span>
                </div>
                <div style={{ fontSize: 11, color: T.sub }}>
                  {user?.goal === "lose fat" ? "−18% deficit" : user?.goal === "build muscle" ? "+10% surplus" : "Maintenance"}
                </div>
              </div>
            </div>

            {/* Macro bars */}
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 14, letterSpacing: 2, color: T.sub, marginBottom: 10 }}>DAILY MACROS</div>
            {[
              { label: "Protein", val: tdee.protein, unit: "g", color: T.accent, max: 250, icon: "🥩" },
              { label: "Carbs", val: tdee.carbs, unit: "g", color: T.accent2, max: 500, icon: "🍚" },
              { label: "Fat", val: tdee.fat, unit: "g", color: T.green, max: 120, icon: "🥑" },
            ].map(m => (
              <div key={m.label} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 13 }}>{m.icon} {m.label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: m.color, fontWeight: 700 }}>{m.val}{m.unit}</span>
                </div>
                <div style={{ height: 7, background: T.border, borderRadius: 4 }}>
                  <div style={{ width: `${Math.min((m.val / m.max) * 100, 100)}%`, height: "100%", background: m.color, borderRadius: 4, transition: "width 0.6s" }} />
                </div>
              </div>
            ))}

            <div style={{ fontSize: 11, color: T.sub, marginTop: 8, fontStyle: "italic" }}>
              Calculated via Mifflin-St Jeor formula · {({ beginner: "Moderately active", intermediate: "Very active", advanced: "Extremely active" })[user?.experience]} · Updates when you edit profile
            </div>
          </div>
        ) : (
          <div style={{ ...s.card, background: T.accent + "0a", border: `1px dashed ${T.accent}44`, marginBottom: 16, textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📊</div>
            <div style={{ fontSize: 14, color: T.sub }}>Add your age, height & weight to unlock your personalised calorie & macro targets</div>
            <button onClick={() => setEditing(true)} style={{ ...s.btn(T.accent, false), margin: "12px auto 0", justifyContent: "center" }}>✏️ Fill Profile</button>
          </div>
        )}

        {/* ── BODY STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          <StatBox value={user?.bmi} label="BMI" color={user?.bmi ? getBMICategory(user.bmi).color : T.sub} />
          <StatBox value={user?.weight ? `${user.weight}kg` : null} label="WEIGHT" color={T.accent2} />
          <StatBox value={user?.height ? `${user.height}cm` : null} label="HEIGHT" color={T.accent3} />
          <StatBox value={user?.age ? `${user.age}yr` : null} label="AGE" color={T.green} />
        </div>

        {/* ── EDIT FORM ── */}
        {editing && (
          <div style={{ ...s.card, border: `1px solid ${T.accent}66`, animation: "slideUp 0.3s ease" }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 3, color: T.accent, marginBottom: 20 }}>EDIT PROFILE</div>

            {/* Personal */}
            <div style={{ ...s.card, background: T.card2, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: T.sub, letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>PERSONAL INFO</div>
              <Field label="Fighter Name">
                <input style={s.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
              </Field>
              <Field label="Email">
                <input style={s.input} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
              </Field>
              <Field label="Gender">
                <div style={{ display: "flex", gap: 8 }}>
                  {["male", "female", "other"].map(g => (
                    <button key={g} onClick={() => setForm(f => ({ ...f, gender: g }))}
                      style={{ ...s.btn(form.gender === g ? T.accent : T.sub, form.gender !== g), flex: 1, justifyContent: "center", padding: "9px 4px", fontSize: 12 }}>
                      {g === "male" ? "♂ Male" : g === "female" ? "♀ Female" : "⚧ Other"}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Age">
                <input style={s.input} type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="Age in years" />
              </Field>
            </div>

            {/* Body */}
            <div style={{ ...s.card, background: T.card2, marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: T.sub, letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>BODY MEASUREMENTS</div>
              <Field label="Height (cm)">
                <input style={s.input} type="number" value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))} placeholder="e.g. 175" />
              </Field>
              <Field label="Weight (kg)">
                <input style={s.input} type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} placeholder="e.g. 75" />
              </Field>
              {liveBmi && liveBmiCat && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: liveBmiCat.color + "18", border: `1px solid ${liveBmiCat.color}44`, borderRadius: 10, padding: "10px 14px" }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 28, color: liveBmiCat.color, lineHeight: 1 }}>{liveBmi}</div>
                    <div style={{ fontSize: 10, color: T.sub, letterSpacing: 2 }}>NEW BMI</div>
                  </div>
                  <div style={{ ...s.badge(liveBmiCat.color), fontSize: 13 }}>{liveBmiCat.label}</div>
                </div>
              )}
            </div>

            {/* Goals + Intensity */}
            <div style={{ ...s.card, background: T.card2, marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: T.sub, letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>TRAINING CONFIGURATION</div>
              <Field label="Primary Goal">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[["lose fat", "🔥 Lose Fat"], ["build muscle", "💪 Build Muscle"], ["improve performance", "⚡ Improve Performance"]].map(([val, lbl]) => (
                    <button key={val} onClick={() => setForm(f => ({ ...f, goal: val }))}
                      style={{ ...s.btn(form.goal === val ? T.accent : T.sub, form.goal !== val), justifyContent: "flex-start", fontSize: 14 }}>
                      {form.goal === val ? "✓ " : ""}{lbl}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Intensity Level">
                <div style={{ display: "flex", gap: 8 }}>
                  {[["beginner", "🟢", "New"], ["intermediate", "🟡", "6–12mo"], ["advanced", "🔴", "1yr+"]].map(([val, dot, sub]) => (
                    <button key={val} onClick={() => setForm(f => ({ ...f, experience: val }))}
                      style={{ ...s.btn(form.experience === val ? T.accent2 : T.sub, form.experience !== val), flex: 1, flexDirection: "column", alignItems: "center", padding: "10px 6px", gap: 3, fontSize: 11 }}>
                      <span style={{ fontSize: 16 }}>{dot}</span>
                      <span style={{ textTransform: "capitalize", fontWeight: 700, fontSize: 12 }}>{val}</span>
                      <span style={{ fontSize: 10, color: form.experience === val ? "#ffffffaa" : T.sub }}>{sub}</span>
                    </button>
                  ))}
                </div>
              </Field>

              {/* Live calorie preview while editing */}
              {form.age && form.height && form.weight && (() => {
                const preview = calcTDEE({ ...user, ...form });
                return preview ? (
                  <div style={{ background: T.accent2 + "12", border: `1px solid ${T.accent2}33`, borderRadius: 10, padding: "12px 14px", marginTop: 8 }}>
                    <div style={{ fontSize: 11, color: T.accent2, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>📊 LIVE PREVIEW — CALORIE TARGET</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, textAlign: "center" }}>
                      {[["Protein", preview.protein + "g", T.accent], ["Carbs", preview.carbs + "g", T.accent2], ["Fat", preview.fat + "g", T.green]].map(([l, v, c]) => (
                        <div key={l}>
                          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 18, color: c }}>{v}</div>
                          <div style={{ fontSize: 10, color: T.sub, letterSpacing: 1 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ textAlign: "center", marginTop: 10, fontFamily: "'JetBrains Mono'", fontSize: 20, color: T.accent2 }}>
                      {preview.target} <span style={{ fontSize: 12, color: T.sub }}>kcal / day</span>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditing(false)} style={{ ...s.btn(T.sub, true), flex: 1, justifyContent: "center" }}>✕ Cancel</button>
              <button onClick={save} style={{ ...s.btn(T.green, false), flex: 2, justifyContent: "center", fontSize: 15 }}>✓ Save Profile</button>
            </div>
          </div>
        )}

        {/* Danger zone */}
        <div style={{ ...s.card, border: `1px solid ${T.accent}33`, marginTop: 16, background: T.accent + "06" }}>
          <div style={{ fontSize: 12, color: T.accent, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>ACCOUNT</div>
          <button onClick={logoutUser} style={{ ...s.btn(T.accent, true), width: "100%", justifyContent: "center", fontSize: 14 }}>
            👋 Sign Out
          </button>
        </div>
      </div>
    );
  };

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
      <div style={s.app}>
        {breathScreen ? <BreathingScreen /> : <ActiveTimer />}
      </div>
    </>
  );

  const navItems = [
    { label: "🏠 Home", key: "home" },
    { label: "🧘 Recovery", key: "recovery" },
    { label: "🥗 Diet", key: "diet" },
    { label: "🛠️ Tools", key: "knuckle" },
    { label: "🎯 Goals", key: "goals" },
    { label: "📊 Progress", key: "progress" },
    { label: "👤 Profile", key: "profile" },
  ];

  return (
    <>
      <style>{css}</style>
      <div style={s.app}>
        {/* Google completion modal — shown over everything when googlePending is set */}
        {googlePending && <GoogleCompletionModal />}

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
              <button onClick={() => setScreen("profile")} title="Profile" style={{ ...s.toggle, padding: "4px", border: screen === "profile" ? `2px solid ${T.accent}` : "2px solid transparent", borderRadius: "50%" }}>
                {user.googleAvatar
                  ? <img src={user.googleAvatar} alt="avatar" style={{ width: 28, height: 28, borderRadius: "50%", display: "block" }} />
                  : <span style={{ fontSize: 22 }}>👤</span>}
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
          {screen === "knuckle" && <TrainingToolsScreen />}
          {screen === "goals" && <GoalsScreen />}
          {screen === "progress" && <ProgressScreen />}
          {screen === "profile" && <ProfileScreen />}
        </div>
      </div>
    </>
  );
}