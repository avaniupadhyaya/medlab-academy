// ── questions_emergency_healthy.js ──
// HOSA Academy — Life Threatening Situations + Foundations of Healthy Living
window.QB_EMERGENCY = {
flashcards: {
easy: [
  {term:"CPR",def:"Cardiopulmonary Resuscitation; chest compressions + rescue breaths to maintain circulation",breakdown:"Rate: 100-120/min; Depth: 2-2.4 inches adults"},
  {term:"AED",def:"Automated External Defibrillator; delivers electric shock to restore normal heart rhythm",breakdown:"Turn on → Attach pads → Follow voice prompts → Shock if advised"},
  {term:"Cardiac arrest",def:"Heart suddenly stops pumping effectively; requires immediate CPR + AED",breakdown:"Different from heart attack (blockage); arrest = no pulse"},
  {term:"Heimlich maneuver",def:"Abdominal thrusts to dislodge airway obstruction in conscious choking adult",breakdown:"Stand behind, hands above navel, inward and upward thrusts"},
  {term:"Shock",def:"Inadequate blood/oxygen to vital organs; life-threatening emergency",breakdown:"Signs: pale/cold skin, rapid weak pulse, confusion, low BP"},
  {term:"Recovery position",def:"Stable side-lying position for unconscious breathing patient",breakdown:"Prevents airway obstruction from vomit or tongue"},
  {term:"Universal precautions",def:"Treat all blood/body fluids as potentially infectious; wear PPE",breakdown:"Gloves, mask, gown when indicated; hand washing"},
  {term:"Anaphylaxis",def:"Severe life-threatening allergic reaction; requires epinephrine immediately",breakdown:"Signs: hives, throat swelling, breathing difficulty, low BP"},
  {term:"Epinephrine (EpiPen)",def:"Drug that reverses anaphylaxis; constricts blood vessels, opens airways",breakdown:"Injected into outer thigh; call 911 even after using"},
  {term:"Stroke (FAST)",def:"Brain blood supply disruption; Face drooping, Arm weakness, Speech slurring, Time to call 911",breakdown:"Time critical — brain cells die every minute without treatment"},
  {term:"Heart attack signs",def:"Chest pain/pressure, left arm/jaw pain, sweating, nausea, shortness of breath",breakdown:"Not always dramatic — women may have atypical symptoms"},
  {term:"Bleeding control",def:"Direct pressure → elevation → pressure point → tourniquet (last resort)",breakdown:"Never remove a dressing; add more on top"},
  {term:"Tourniquet",def:"Tight band applied above wound to stop severe limb bleeding",breakdown:"Apply 2-3 inches above wound; note time applied"},
  {term:"Burns classification",def:"1st degree: skin redness; 2nd: blisters; 3rd: full thickness, charred",breakdown:"Cool with water; never ice; cover with clean dressing"},
  {term:"Fracture first aid",def:"Immobilize (splint) in position found; do not straighten; check circulation",breakdown:"Check pulse, sensation, movement distal to fracture"},
],
medium: [
  {term:"Adult CPR ratio",def:"30 compressions : 2 breaths (one-rescuer); 30:2 (two-rescuer adult)",breakdown:"Compression depth: 2-2.4 inches; rate 100-120/min"},
  {term:"Child CPR",def:"30:2 one rescuer; 15:2 two rescuers; heel of one hand or two-finger technique",breakdown:"Depth: 2 inches; same 100-120/min rate"},
  {term:"Infant CPR",def:"2 fingers on breastbone; 30:2 one rescuer; 15:2 two rescuers",breakdown:"Depth: 1.5 inches; cover mouth AND nose"},
  {term:"CAB sequence",def:"Compressions → Airway → Breathing (replaced old ABC)",breakdown:"Compressions first — most critical intervention"},
  {term:"Diabetic emergency (hypoglycemia)",def:"Low blood sugar (<70 mg/dL); shaking, sweating, confusion",breakdown:"Conscious: give sugar (juice, glucose tablets). Unconscious: 911"},
  {term:"Hyperglycemia",def:"High blood sugar (>180 mg/dL); fruity breath, excessive thirst, frequent urination",breakdown:"Diabetic ketoacidosis (DKA) is life-threatening complication"},
  {term:"Seizure first aid",def:"Protect from injury, do not restrain, turn on side, time the seizure",breakdown:"NEVER put anything in mouth; stay until fully conscious"},
  {term:"Poison control",def:"1-800-222-1222 (US); call before attempting any treatment",breakdown:"Do NOT induce vomiting unless directed by poison control"},
  {term:"Drowning/near-drowning",def:"Remove from water safely; check pulse; start CPR if no pulse",breakdown:"Hypothermia common; treat for shock"},
  {term:"Heat stroke",def:"Core temp >104°F; hot dry skin, confusion, no sweating — EMERGENCY",breakdown:"Cool immediately: ice packs to neck, groin, armpits; call 911"},
  {term:"Heat exhaustion",def:"Heavy sweating, weakness, cool pale skin, nausea — precursor to heat stroke",breakdown:"Move to cool area, water, rest; if worsens → heat stroke"},
  {term:"Hypothermia",def:"Core temp <95°F; shivering, confusion, slow pulse",breakdown:"Remove wet clothing, warm gradually, call 911 if severe"},
  {term:"Frostbite",def:"Tissue freezing from extreme cold; white/gray/waxy skin",breakdown:"Do NOT rub; rewarm in warm (not hot) water if no refreeze risk"},
  {term:"Spinal injury",def:"Suspect in any head/neck trauma, diving accident, significant fall",breakdown:"Immobilize head and neck; do not move unless immediate danger"},
  {term:"Triage",def:"Sorting patients by severity to prioritize treatment when resources are limited",breakdown:"START triage: Red (immediate), Yellow (delayed), Green (minor), Black (deceased)"},
,
  {term:"CPR compression quality factors",def:"Depth (2-2.4 in adults), rate (100-120/min), full recoil, minimal interruptions, correct hand placement",breakdown:"Most common errors: insufficient depth, leaning on chest between compressions, interrupting for >10 sec"},
  {term:"Child vs infant CPR differences",def:"Child (1yr-puberty): heel of 1-2 hands, 2 inch depth, 1-rescuer 30:2, 2-rescuer 15:2",breakdown:"Infant (<1yr): 2 fingers on center of chest below nipples, 1.5 inch depth, cover both mouth and nose"},
  {term:"AED special situations",def:"Wet patient: dry chest first. Implanted device: pads 2 inches away. Pediatric: use child pads if available",breakdown:"Medication patches: remove and wipe. Never delay defibrillation for perfect conditions"},
  {term:"Ventricular fibrillation",def:"Chaotic unsynchronized ventricular quivering — no effective pumping — most common cardiac arrest rhythm",breakdown:"AED/defibrillator delivers shock to reset electrical activity. CPR maintains minimal perfusion between shocks"},
  {term:"Tourniquet application details",def:"Apply 2-3 inches ABOVE wound. Tighten until bleeding STOPS. Write time on tourniquet or skin",breakdown:"Commercial tourniquets (CAT, SOFTT-W) preferred. Width matters: narrow band cuts without stopping bleeding"},
  {term:"Wound packing for junctional wounds",def:"Pack hemostatic gauze tightly into deep wound. Apply firm direct pressure for minimum 3 minutes",breakdown:"Junctional wounds (groin, axilla, neck) cannot receive tourniquet — wound packing is the alternative"},
  {term:"Types of shock",def:"Hypovolemic (fluid/blood loss), Cardiogenic (pump failure), Distributive (sepsis/anaphylaxis), Obstructive (PE/tamponade)",breakdown:"All share: inadequate tissue perfusion. All cause: tachycardia, hypotension, altered mental status (late sign)"},
  {term:"Anaphylaxis pathophysiology",def:"IgE-mediated: mast cells release histamine + other mediators causing vasodilation and bronchoconstriction",breakdown:"Epinephrine reverses ALL manifestations — vasoconstriction raises BP, bronchodilation opens airway"},
  {term:"EpiPen administration",def:"Remove blue cap. Press orange tip firmly to outer thigh (through clothing is fine). Hold 10 seconds",breakdown:"Adult: 0.3 mg epinephrine. Junior: 0.15 mg. Call 911 even after use — biphasic reaction can occur hours later"},
  {term:"Stroke treatment time window",def:"IV tPA (alteplase) must be given within 3-4.5 hours of symptom onset for eligible patients",breakdown:"Mechanical thrombectomy (catheter clot removal) effective up to 24 hours in selected patients"},
  {term:"Diabetic emergency comparison",def:"Hypoglycemia (<70): rapid onset, shaking, sweating, confusion. Hyperglycemia: gradual, fruity breath, polyuria",breakdown:"Conscious and low glucose: give 15g sugar. Unconscious: IV dextrose or glucagon. NEVER oral to unconscious"},
  {term:"Seizure: when to call 911",def:"Call 911: seizure >5 minutes, no return to consciousness, repeated seizures (status epilepticus), first-ever seizure",breakdown:"Also call: injury during seizure, diabetic/pregnant patient, post-seizure difficulty breathing"},
  {term:"Hypothermia treatment principles",def:"Remove wet clothing. Warm core first with warm environment and blankets. Warm fluids if conscious",breakdown:"Handle very gently — cold heart prone to VF. Add heat gradually. Never give alcohol"},
  {term:"Frostbite first aid",def:"Do NOT rub frostbitten tissue. Rewarm in warm water (100-108F) ONLY if no risk of refreezing",breakdown:"Rewarming is very painful (good sign — means circulation returning). Sterile dressing. No blisters popped"},
  {term:"Hypovolemic shock stages",def:"Class I: <15% loss, no symptoms. Class II: 15-30%, tachycardia. Class III: 30-40%, hypotension. Class IV: >40%, lethal",breakdown:"Adult blood volume ~70 mL/kg. 70 kg adult = ~4,900 mL total. Class III = nearly 2 liters lost"},
  {term:"Pediatric airway differences",def:"Larger tongue relative to mouth, floppy epiglottis, funnel-shaped airway (narrowest at cricoid), obligate nose breathers",breakdown:"These differences make pediatric airway management more challenging than adults"},
  {term:"Burns: rule of nines",def:"Head 9%, each arm 9%, chest (front) 18%, back 18%, each leg 18%, genitals 1%",breakdown:"Used to estimate % body surface area burned — guides fluid resuscitation (Parkland formula)"},
  {term:"Carbon monoxide poisoning",def:"Colorless, odorless gas. Binds hemoglobin (240x stronger than O2). Causes tissue hypoxia despite normal SpO2",breakdown:"Pulse ox reads FALSELY NORMAL. Suspect in: headache, nausea, confusion in enclosed space. Treatment: 100% O2"},
  {term:"Drowning first aid",def:"Remove from water safely. Check pulse — start CPR if absent. Assume hypothermia. Treat for shock",breakdown:"Submersion victims: always transport to hospital even if they seem fine (secondary drowning risk up to 72 hrs)"},
  {term:"Tension pneumothorax recognition",def:"Absent breath sounds one side + tracheal deviation AWAY from affected side + hypotension + JVD",breakdown:"Medical emergency. Air accumulates, cannot escape, compresses heart and opposite lung. Needle decompression"}

],
hard: [
  {term:"START triage system",def:"Red=immediate (life threat, survivable), Yellow=delayed (serious, stable), Green=minor, Black=dead/unsurvivable",breakdown:"Sort in <60 seconds per patient. Respirations >30 or absent = Red (after repositioning airway)"},
  {term:"Cardiac tamponade Becks Triad",def:"Blood in pericardial sac compresses heart. Becks Triad: hypotension + muffled heart sounds + JVD",breakdown:"Pericardiocentesis (needle aspiration of blood) is life-saving treatment. Can follow chest trauma"},
  {term:"Crush syndrome pathophysiology",def:"Prolonged muscle compression releases myoglobin. When pressure released, myoglobin enters blood and damages kidneys",breakdown:"Never release crush injury without IV access. Give fluids BEFORE release to prevent renal failure"},
  {term:"Compartment syndrome 6 Ps",def:"Pain (disproportionate), Pressure (tense compartment), Pallor, Pulselessness (late), Paresthesia, Paralysis",breakdown:"Emergency fasciotomy required within 6 hours. Caused by: fractures, circumferential burns, reperfusion"},
  {term:"Electrical injury principles",def:"Current follows path of least resistance. Entry wound small, exit wound larger. Internal injuries extensive",breakdown:"Requires: cardiac monitoring (VF risk), kidney function monitoring (myoglobin), burn wound care"},
  {term:"Chemical burn management",def:"Water irrigation (NOT neutralization) for 20-30 minutes. Remove contaminated clothing",breakdown:"Neutralization generates heat, worsens injury. Hydrofluoric acid exception: calcium gluconate antidote"},
  {term:"Sucking chest wound treatment",def:"Cover with vented (3-sided) occlusive dressing — allows air out but not in",breakdown:"Unvented seal can cause tension pneumothorax. Improvise with: Vaseline gauze, plastic taped 3 sides"},
  {term:"Hemorrhagic shock fluid resuscitation",def:"Balanced crystalloids (Lactated Ringers) preferred over Normal Saline for large-volume resuscitation",breakdown:"LR is more physiologic — less hyperchloremic acidosis. 1:1:1 ratio (RBC:plasma:platelets) for massive transfusion"},
  {term:"Spinal motion restriction indications",def:"Significant mechanism (fall >20ft, high-speed MVC, diving) + altered mental status or neurological signs",breakdown:"NOT required for low-risk patients. Unnecessary immobilization can cause pressure sores, airway compromise"},
  {term:"Pediatric assessment triangle",def:"Appearance (TICLS: Tone, Interactivity, Consolability, Look, Speech/cry), Work of breathing, Circulation",breakdown:"Used for initial rapid pediatric assessment before touching patient. Identifies sick vs not sick child"}
]
},
quiz: {
easy: [
  {q:"What does CPR stand for?",opts:["Cardiac Pressure Response","Cardiopulmonary Resuscitation","Critical Patient Recovery","Cardiac Pump Restoration"],correct:1,explain:"CPR = Cardiopulmonary Resuscitation. 'Cardio' = heart, 'pulmonary' = lungs. CPR manually pumps blood and maintains breathing for someone whose heart has stopped."},
  {q:"For adult CPR, the correct compression-to-breath ratio is:",opts:["15:2","20:2","30:2","5:1"],correct:2,explain:"30:2 is the standard adult CPR ratio — 30 chest compressions followed by 2 rescue breaths. Compressions should be 100-120 per minute, 2-2.4 inches deep."},
  {q:"What does AED stand for?",opts:["Automatic Emergency Device","Automated External Defibrillator","Advanced Emergency Detection","Acute External Device"],correct:1,explain:"AED = Automated External Defibrillator. It analyzes heart rhythm and delivers an electric shock to restore normal rhythm in cardiac arrest."},
  {q:"The FAST acronym for stroke recognition stands for:",opts:["Fever, Anxiety, Swelling, Treatment","Face, Arms, Speech, Time","Fall, Alert, Stroke, Test","Fast, Aware, Safe, Treatment"],correct:1,explain:"FAST: Face drooping (ask them to smile), Arm weakness (one arm drift?), Speech slurring, Time to call 911. Time is critical — 'time is brain.'"},
  {q:"The Heimlich maneuver is used for:",opts:["Cardiac arrest","Conscious choking victim","Unconscious person","Stroke victim"],correct:1,explain:"The Heimlich maneuver (abdominal thrusts) is used for a conscious adult who is choking. Stand behind, find the belly button, place fist above it, give quick inward-upward thrusts."},
  {q:"Anaphylaxis should be treated immediately with:",opts:["Antihistamine (Benadryl)","Aspirin","Epinephrine (EpiPen)","Ice pack"],correct:2,explain:"Epinephrine (adrenaline) is the ONLY first-line treatment for anaphylaxis. It reverses the allergic reaction by constricting blood vessels and opening airways. Call 911 even after using EpiPen."},
  {q:"Signs of shock include:",opts:["High blood pressure and slow heart rate","Pale/cold/clammy skin, rapid weak pulse, confusion","Flushed skin and strong pulse","High fever and strong pulse"],correct:1,explain:"Shock signs: pale/cold/clammy skin, rapid weak pulse, confusion, anxiety, decreased BP, rapid shallow breathing. Shock = inadequate blood flow to vital organs."},
  {q:"For a burn, you should first:",opts:["Apply butter or ointment","Break any blisters","Cool with cool running water for 10-20 minutes","Apply ice directly"],correct:2,explain:"Cool running water (not ice!) for 10-20 minutes is first aid for burns. Ice can cause further tissue damage (frostbite on top of burn). Never apply butter, ointment, or toothpaste."},
  {q:"What should you do for a suspected spinal injury?",opts:["Move the person to a comfortable position","Have them try to walk it off","Immobilize the head and neck; do not move","Rub the back to reduce pain"],correct:2,explain:"Suspect spinal injury in any head/neck trauma, diving accident, or significant fall. Immobilize the head and neck, do not move the person, call 911 immediately."},
  {q:"The correct order for CPR is now:",opts:["Airway → Breathing → Compressions (ABC)","Compressions → Airway → Breathing (CAB)","Breathing → Compressions → Airway (BCA)","Airway → Compressions → Breathing (ACB)"],correct:1,explain:"The 2010 AHA guidelines changed CPR from ABC to CAB — Compressions first, then Airway, then Breathing. Compressions are the most critical intervention."},
],
medium: [
  {q:"For a child (age 1-8) who needs CPR with TWO rescuers, the correct ratio is:",opts:["30:2","15:2","20:2","5:1"],correct:1,explain:"Two-rescuer child CPR uses 15:2 (15 compressions, 2 breaths). One-rescuer child CPR uses 30:2 (same as adult). Depth: 2 inches for children."},
  {q:"A conscious patient has signs of low blood sugar (hypoglycemia): shaking, sweating, confused. You should:",opts:["Give insulin","Give orange juice or glucose tablets","Have them lie down and wait","Give aspirin"],correct:1,explain:"For conscious hypoglycemia: give fast-acting sugar — 4 oz juice, glucose tablets, or regular soda. Recheck in 15 min. Never give anything by mouth to an unconscious person."},
  {q:"Heat stroke is different from heat exhaustion because heat stroke involves:",opts:["Heavy sweating","Cool pale skin","Temperature above 104°F with no sweating — life-threatening","Nausea and dizziness only"],correct:2,explain:"Heat stroke: temp >104°F, hot dry skin (no sweating), confusion, possible unconsciousness — EMERGENCY. Heat exhaustion: heavy sweating, cool pale skin, nausea — serious but treatable with rest and hydration."},
  {q:"During a seizure, you should:",opts:["Hold the person down to prevent injury","Put something in their mouth to prevent biting","Remove nearby hazards, turn on side, time the seizure","Give the person water"],correct:2,explain:"During a seizure: move away hazards, cushion the head, turn on side (recovery position) to prevent aspiration, time the seizure, and stay until fully conscious. NEVER restrain or put anything in the mouth."},
  {q:"A tourniquet should be applied:",opts:["Directly over the wound","2-3 inches above the wound","Below the wound","Only to leg wounds"],correct:1,explain:"Apply a tourniquet 2-3 inches above (proximal to) the wound — between the wound and the heart. Note the exact time of application on the tourniquet or patients skin. Tourniquets are a last resort for severe, life-threatening limb bleeding."},
  {q:"Triage color RED means:",opts:["Patient is deceased","Minor injuries, can wait","Delayed — serious but can wait","Immediate — life-threatening but survivable with treatment"],correct:3,explain:"START Triage: RED = Immediate (life-threatening, can survive with treatment). YELLOW = Delayed (serious, stable). GREEN = Minor. BLACK = Deceased/unsurvivable. Red patients get treatment first."},
]
}
}; // end QB_EMERGENCY

// ─────────────────────────────────────────────────────
window.QB_HEALTHY_LIVING = {
flashcards: {
easy: [
  {term:"Physical activity guidelines (youth)",def:"60+ minutes of moderate-to-vigorous activity DAILY for ages 6-17",breakdown:"Aerobic (most), plus muscle + bone strengthening 3x/week"},
  {term:"Aerobic exercise",def:"Sustained activity that raises heart rate and breathing rate",breakdown:"Examples: running, swimming, cycling, dancing"},
  {term:"Anaerobic exercise",def:"Short bursts of high-intensity activity; builds muscle strength",breakdown:"Examples: sprinting, weightlifting, HIIT"},
  {term:"Sleep recommendations (teens)",def:"8-10 hours per night for teenagers (13-18 years)",breakdown:"Sleep deprivation linked to obesity, mental health issues, poor grades"},
  {term:"Mental health",def:"Emotional, psychological, and social well-being",breakdown:"Affects how we think, feel, act, and handle stress"},
  {term:"Stress management",def:"Techniques to control bodys response to challenges",breakdown:"Exercise, deep breathing, sleep, social support, mindfulness"},
  {term:"Substance abuse",def:"Harmful use of alcohol, tobacco, drugs; impacts developing brains especially",breakdown:"Teen brain is especially vulnerable to addiction"},
  {term:"Nicotine",def:"Addictive chemical in tobacco and e-cigarettes; harmful to developing brains",breakdown:"Vaping exposes teens to nicotine and toxic chemicals"},
  {term:"Tobacco effects",def:"Cancer (lung, mouth, throat), heart disease, COPD, stroke",breakdown:"No safe level of tobacco use"},
  {term:"Preventive care",def:"Actions taken to prevent disease before it occurs",breakdown:"Vaccines, screenings, healthy diet, exercise, not smoking"},
  {term:"Health literacy",def:"Ability to find, understand, and use health information",breakdown:"Essential for making good health decisions"},
  {term:"Sedentary behavior",def:"Too much sitting/screen time with little physical movement",breakdown:"Linked to obesity, diabetes, heart disease, depression"},
  {term:"BMI (Body Mass Index)",def:"Estimate of body fatness based on height and weight",breakdown:"Screening tool only; not diagnostic on its own"},
  {term:"Immunization (vaccine)",def:"Preparation that stimulates immune response to prevent disease",breakdown:"Herd immunity: enough vaccinated people protect vulnerable"},
  {term:"Hydration",def:"Maintaining adequate fluid intake for body function",breakdown:"8 cups (64 oz) water/day baseline; more with exercise/heat"},
],
medium: [
  {term:"Social determinants of health",def:"Non-medical factors affecting health: income, education, housing, neighborhood",breakdown:"Account for 30-55% of health outcomes"},
  {term:"Health disparities",def:"Preventable differences in health outcomes between population groups",breakdown:"Linked to race, income, geography, education, gender"},
  {term:"Chronic disease",def:"Long-lasting condition (1+ year) requiring ongoing management",breakdown:"Examples: diabetes, heart disease, asthma, hypertension"},
  {term:"Risk factors",def:"Conditions that increase likelihood of developing disease",breakdown:"Modifiable: smoking, diet, exercise. Non-modifiable: age, genetics"},
  {term:"Protective factors",def:"Conditions that decrease likelihood of disease or promote wellbeing",breakdown:"Exercise, social connections, sleep, positive relationships"},
  {term:"Mental health stigma",def:"Negative attitudes toward people with mental health conditions",breakdown:"Prevents people from seeking help; education reduces stigma"},
  {term:"Mindfulness",def:"Focused awareness on present moment; reduces stress and anxiety",breakdown:"Meditation, deep breathing, yoga are mindfulness practices"},
  {term:"Depression",def:"Persistent sadness, loss of interest, impaired function for 2+ weeks",breakdown:"Treatable with therapy and/or medication; not a character flaw"},
  {term:"Anxiety disorder",def:"Excessive, persistent fear or worry interfering with daily life",breakdown:"Most common mental health condition; highly treatable"},
  {term:"Eating disorders",def:"Serious conditions related to disordered eating patterns and body image",breakdown:"Anorexia, bulimia, binge eating disorder; require professional treatment"},
  {term:"Cardiovascular fitness",def:"Heart and lungs' ability to supply oxygen to muscles during sustained activity",breakdown:"Improved by aerobic exercise; measured by VO2 max"},
  {term:"Flexibility",def:"Range of motion in joints; reduced by sedentary behavior",breakdown:"Improved by stretching; reduces injury risk"},
  {term:"Muscular endurance",def:"Ability of muscle to sustain repeated contractions over time",breakdown:"Running, cycling, push-ups; different from strength"},
  {term:"FITT principle",def:"Frequency, Intensity, Time, Type — framework for exercise prescription",breakdown:"Customize training by adjusting these 4 variables"},
  {term:"Target heart rate zone",def:"60-85% of maximum heart rate; optimal zone for aerobic benefit",breakdown:"Max HR ≈ 220 - age; aerobic zone = 60-85% of max"},
,
  {term:"5 components of physical fitness",def:"Cardiovascular endurance, muscular strength, muscular endurance, flexibility, body composition",breakdown:"HOSA tests: definition of each component, how to improve each, and health benefits of each"},
  {term:"Progressive overload principle",def:"Must gradually increase training demands (weight, reps, sets, frequency, intensity) to continue improving",breakdown:"Without overload, body adapts and progress stops. Increase demand by 5-10% per week maximum"},
  {term:"Target heart rate zone",def:"60-85% of maximum heart rate (220 - age). Optimal zone for aerobic benefit",breakdown:"14-year-old: Max HR = 206. Target zone = 124-175 bpm. Below this = too easy. Above = too intense"},
  {term:"Muscle fiber types",def:"Type I (slow-twitch): aerobic, fatigue-resistant, red color. Type II (fast-twitch): anaerobic, powerful, white",breakdown:"Endurance training increases Type I. Strength/power training increases Type II. Both types are trainable"},
  {term:"Sleep architecture",def:"NREM Stage 1 (light) > NREM 2 > NREM 3 (deep/slow wave) > REM (dreaming). Cycle ~90 min",breakdown:"Deep sleep: physical repair, growth hormone release. REM: memory consolidation, emotional processing"},
  {term:"Circadian rhythm",def:"24-hour internal body clock regulating sleep/wake, hormones, body temperature, metabolism",breakdown:"Disrupted by: shift work, jet lag, blue light (screens) at night. Disruption linked to metabolic disease"},
  {term:"Adolescent vaccine schedule",def:"HPV series, Tdap booster (age 11-12), meningococcal, annual influenza",breakdown:"HPV vaccine prevents 6 types of cancer. Most effective when given before sexual activity begins"},
  {term:"3 levels of prevention",def:"Primary: prevent disease before it occurs. Secondary: early detection. Tertiary: reduce disease impact",breakdown:"Primary = vaccine. Secondary = mammogram. Tertiary = cardiac rehab after heart attack"},
  {term:"Social determinants of health",def:"5 domains (Healthy People 2030): Economic stability, Education, Healthcare access, Neighborhood, Social context",breakdown:"Account for 80-90% of health outcomes — far more than medical care alone"},
  {term:"Adverse Childhood Experiences (ACEs)",def:"Abuse, neglect, household dysfunction in childhood. ACE score = number of categories experienced",breakdown:"4+ ACEs doubles risk of heart disease, cancer, diabetes, and depression. Trauma-informed care is response"},
  {term:"Depression diagnostic criteria",def:"5+ symptoms for 2+ weeks including depressed mood OR loss of interest/pleasure",breakdown:"SIGECAPS: Sleep, Interest, Guilt, Energy, Concentration, Appetite, Psychomotor changes, Suicidal ideation"},
  {term:"Anxiety disorder spectrum",def:"GAD, panic disorder, social anxiety, specific phobias, separation anxiety — all share excessive fear/worry",breakdown:"Most common mental health condition — 19% of US adults annually. All are highly treatable"},
  {term:"Opioid overdose signs",def:"Unconscious, slow or absent breathing, pin-point pupils, cyanosis (blue lips/fingertips), gurgling sounds",breakdown:"Naloxone (Narcan): IN intranasally or IM injection. Works in 2-3 minutes. Short-acting — may need repeat doses"},
  {term:"Motivational interviewing",def:"Patient-centered counseling to strengthen motivation for health behavior change. Uses OARS technique",breakdown:"OARS: Open questions, Affirmation, Reflective listening, Summary. Avoids confrontation and lecturing"},
  {term:"Stages of Change model",def:"Precontemplation > Contemplation > Preparation > Action > Maintenance. Relapse is part of the process",breakdown:"Match intervention to stage. Pushing action on someone in precontemplation = resistance and failure"},
  {term:"Health equity definition",def:"Everyone has fair opportunity to attain their highest level of health, regardless of circumstances",breakdown:"Requires addressing systemic barriers and social determinants — not just providing equal resources"},
  {term:"Substance use disorder biology",def:"Dopamine reward pathway is hijacked. Tolerance, dependence, and cravings are neurobiological changes",breakdown:"Prefrontal cortex (decision-making) weakened. Amygdala (craving/emotion) strengthened. Not a choice"},
  {term:"Teen brain and substance risk",def:"Prefrontal cortex (judgment, impulse control) not fully developed until age 25",breakdown:"Teen brain more susceptible to addiction. Earlier use = higher lifetime addiction risk. Every year of delay helps"},
  {term:"Allostatic load",def:"Cumulative physiological wear from chronic stress — measurable through cortisol, BP, inflammatory markers",breakdown:"High allostatic load accelerates aging, increases disease risk. Exercise, social support, sleep reduce it"},
  {term:"Epigenetics basics",def:"Environmental/behavioral factors can turn genes on or off without changing DNA sequence",breakdown:"Smoking, diet, stress, exercise all cause epigenetic changes — some heritable across generations"}

],
hard: [
  {term:"Chronic inflammation and disease",def:"Chronic low-grade inflammation is the shared mechanism linking obesity, poor diet, inactivity, stress to most chronic diseases",breakdown:"C-reactive protein (CRP) is a blood marker of systemic inflammation. Anti-inflammatory lifestyle reduces risk"},
  {term:"Health behavior change evidence",def:"Most effective: education + skills training + environmental change + social support COMBINED",breakdown:"Knowledge alone rarely changes behavior. Environment and social norms are equally important drivers"},
  {term:"Syndemic theory",def:"Syndemics = co-occurring, interacting epidemics that share social determinants",breakdown:"Example: COVID-19 mortality disproportionate in communities with pre-existing obesity, diabetes, poverty"},
  {term:"Precision medicine and genetics",def:"Pharmacogenomics: genetic testing to predict drug response and adverse effects",breakdown:"BRCA genes and cancer risk. CYP450 enzymes and drug metabolism. Growing clinical application"},
  {term:"Planetary health and food systems",def:"Food systems contribute 26% of global greenhouse gases. Plant-rich diets are both healthier AND more sustainable",breakdown:"EAT-Lancet Commission: Planetary Health Diet mostly plant-based with small amounts of animal foods"},
  {term:"Structural racism health impacts",def:"Documented disparities: Black women 3x higher maternal mortality. Racial disparities in pain management",breakdown:"Redlining, environmental injustice, implicit bias all contribute to measurable health outcome gaps"},
  {term:"Polypharmacy in elderly",def:"5+ medications simultaneously increases: drug interactions, falls, cognitive impairment, hospitalizations",breakdown:"De-prescribing (safely stopping unnecessary medications) is an emerging clinical priority for elderly care"},
  {term:"Mental health parity laws",def:"Mental Health Parity and Addiction Equity Act: insurance must cover mental health same as physical health",breakdown:"Implementation remains incomplete. Many plans still have higher cost-sharing for mental health services"},
  {term:"Immunological memory",def:"After vaccination or infection, memory B and T cells persist for years providing faster response to re-exposure",breakdown:"Basis of all vaccines. Booster doses strengthen and broaden immune memory. Waning immunity concept"},
  {term:"Health literacy levels",def:"Functional: read drug labels. Interactive: understand medical advice. Critical: evaluate information quality",breakdown:"Only 12% of US adults have proficient health literacy. Low HL causes $238 billion/year in excess healthcare costs"}
]
},
quiz: {
easy: [
  {q:"How many minutes of physical activity do youth (6-17 years) need daily?",opts:["20 minutes","30 minutes","45 minutes","60 minutes"],correct:3,explain:"The Physical Activity Guidelines for Americans recommend 60 minutes (1 hour) of moderate-to-vigorous physical activity daily for children and adolescents ages 6-17."},
  {q:"How many hours of sleep do teenagers need per night?",opts:["5-6 hours","6-8 hours","8-10 hours","10-12 hours"],correct:2,explain:"Teenagers (13-18) need 8-10 hours per night according to the American Academy of Sleep Medicine. Sleep deprivation is linked to obesity, poor mental health, reduced academic performance, and accidents."},
  {q:"Which type of exercise raises heart rate and breathing for an extended period?",opts:["Anaerobic","Aerobic","Isometric","Static"],correct:1,explain:"Aerobic exercise ('cardio') uses oxygen for sustained energy — running, swimming, cycling. It improves cardiovascular and respiratory fitness. 'Aerobic' = with oxygen."},
  {q:"Health literacy means:",opts:["Being able to read medical textbooks","Being a doctor","Ability to find, understand, and use health information to make decisions","Having good grades in health class"],correct:2,explain:"Health literacy is the ability to obtain, process, and understand health information to make appropriate health decisions. Low health literacy is linked to worse health outcomes."},
  {q:"Which is an example of PREVENTIVE care?",opts:["Getting stitches for a cut","Having surgery for appendicitis","Getting a flu vaccine before flu season","Taking antibiotics for pneumonia"],correct:2,explain:"Preventive care happens BEFORE illness to prevent it — vaccines, screenings, healthy lifestyle choices. Reactive care happens after illness. Prevention is always preferable."},
  {q:"Sedentary behavior is MOST linked to which health risk?",opts:["Increased bone density","Reduced obesity risk","Obesity, diabetes, and heart disease","Improved mental health"],correct:2,explain:"Excessive sedentary behavior (sitting, screen time with no movement) is linked to obesity, type 2 diabetes, cardiovascular disease, and depression — independent of whether a person exercises at other times."},
  {q:"Which statement about vaping/e-cigarettes is TRUE?",opts:["Vaping is completely safe compared to smoking","Vaping has no nicotine","Vaping exposes teens to nicotine and toxic chemicals; harms developing brains","Vaping only affects the lungs"],correct:2,explain:"E-cigarettes contain nicotine (highly addictive) and harmful chemicals. The teen brain is especially vulnerable — nicotine can harm developing brain circuits controlling attention, learning, mood, and impulse control."},
  {q:"Mental health includes which components?",opts:["Only emotional wellbeing","Only absence of mental illness","Emotional, psychological, and social wellbeing","Only physical brain health"],correct:2,explain:"Mental health encompasses emotional (how you feel), psychological (how you think), and social (how you relate to others) wellbeing. Good mental health is more than just the absence of illness."},
],
medium: [
  {q:"Social determinants of health include:",opts:["Only genetics and family history","Non-medical factors like income, education, housing, and neighborhood","Only diet and exercise choices","Only access to healthcare"],correct:1,explain:"Social determinants of health are non-medical conditions that influence health: income, education, housing quality, neighborhood safety, social connections. They account for 30-55% of health outcomes."},
  {q:"The FITT principle stands for:",opts:["Fitness, Intensity, Training, Time","Frequency, Intensity, Time, Type","Flexibility, Intervals, Training, Tempo","Frequency, Intervals, Tempo, Training"],correct:1,explain:"FITT = Frequency (how often), Intensity (how hard), Time (how long), Type (what kind). It is the framework for designing effective, personalized exercise programs."},
  {q:"What is the formula for calculating maximum heart rate (approximate)?",opts:["200 minus age","220 minus age","180 plus age","150 plus age"],correct:1,explain:"Maximum Heart Rate ≈ 220 - age. For a 14-year-old: 220-14 = 206 bpm. Target aerobic zone = 60-85% of max HR (123-175 bpm for a 14-year-old)."},
  {q:"Health disparities are best described as:",opts:["Normal differences in health between individuals","Preventable differences in health outcomes between population groups","Differences in hospital quality across states","Individual lifestyle choices"],correct:1,explain:"Health disparities are preventable, unjust differences in health outcomes between groups based on race, income, geography, education, or gender. They reflect social inequities, not natural variation."},
  {q:"Which of the following is a MODIFIABLE risk factor for chronic disease?",opts:["Age","Family genetics","Smoking","Sex assigned at birth"],correct:2,explain:"Modifiable risk factors can be changed — smoking, diet, physical activity, weight, alcohol use. Non-modifiable: age, genetics, sex, race. Focus on what you CAN control."},
]
}
}; // end QB_HEALTHY_LIVING


// ── Dedup patch ────────────────────────────────────────────────────────────
(function(){
  ['QB_EMERGENCY','QB_HEALTHY_LIVING'].forEach(function(v){
    var qb=window[v]; if(!qb) return;
    ['flashcards','quiz'].forEach(function(sec){
      if(!qb[sec]) return;
      ['easy','medium','hard'].forEach(function(d){
        if(!qb[sec][d]) return;
        var seen=new Set();
        qb[sec][d]=qb[sec][d].filter(function(item){
          if(!item) return false;
          var key=(item.term||item.q||item.scenario||'').toLowerCase().trim();
          if(!key) return true;
          if(seen.has(key)) return false;
          seen.add(key); return true;
        });
      });
    });
  });
})();
