// HOSA Academy — Foundations of HOSA Bowl
// Draws from ALL health science topics
window.QB_HOSA_BOWL = {
rounds: [
  // ROUND 1 — HOSA Organization
  {category:"HOSA Organization",q:"What does HOSA stand for?",opts:["Health Occupations Students of America (original name)","Hospital Organizations Supporting America","Health Operations and Sciences Academy","Health Outcomes Support Association"],correct:0,explain:"HOSA's original name was Health Occupations Students of America, founded in 1976. In 2004 the name officially changed to just 'HOSA — Future Health Professionals.'"},
  {category:"HOSA Organization",q:"What year was HOSA founded?",opts:["1966","1971","1976","1982"],correct:2,explain:"HOSA was founded in 1976. It now has over 200,000 members in the US and internationally."},
  {category:"HOSA Organization",q:"How many categories are in the HOSA Competitive Events Program?",opts:["4","5","6","7"],correct:2,explain:"There are 6 categories: Health Science, Health Professions, Emergency Preparedness, Leadership, Teamwork, and Recognition."},
  {category:"HOSA Organization",q:"What is the HOSA motto?",opts:["Health is Our Future","The Hands of HOSA Mold the Health of Tomorrow","Future Health Professionals Lead the Way","Together for Better Health"],correct:1,explain:"HOSA's motto is 'The Hands of HOSA Mold the Health of Tomorrow.' The hands in the HOSA emblem represent the caring of each member."},
  {category:"HOSA Organization",q:"HOSA's tagline is:",opts:["Health Leaders of America","Future Health Professionals","Students for Healthcare","Tomorrow's Healthcare Today"],correct:1,explain:"HOSA's official tagline is 'HOSA — Future Health Professionals,' adopted when the organization rebranded in 2004."},

  // ROUND 2 — Medical Terminology
  {category:"Medical Terminology",q:"What does the prefix 'tachy-' mean?",opts:["Slow","Fast","Large","Painful"],correct:1,explain:"Tachy- means fast/rapid. Tachycardia = fast heart rate (>100 bpm). Tachypnea = fast breathing rate."},
  {category:"Medical Terminology",q:"The suffix '-ectomy' means:",opts:["Inflammation","Surgical removal","Visual examination","Incision"],correct:1,explain:"-ectomy = surgical removal. Appendectomy = remove appendix. Cholecystectomy = remove gallbladder."},
  {category:"Medical Terminology",q:"'Hepatitis' means inflammation of the:",opts:["Heart","Stomach","Liver","Kidney"],correct:2,explain:"Hepat- = liver, -itis = inflammation. Hepatitis = liver inflammation, often caused by viruses (Hep A, B, C)."},
  {category:"Medical Terminology",q:"The prefix 'hypo-' means:",opts:["Above normal","Below normal","Without","Against"],correct:1,explain:"Hypo- = below normal/deficient. Hypoglycemia = low blood sugar. Hypotension = low blood pressure. Hypothermia = low body temperature."},
  {category:"Medical Terminology",q:"'Cardiology' is the study of the:",opts:["Lungs","Skin","Kidneys","Heart"],correct:3,explain:"Cardio- = heart, -ology = study of. Cardiology is the medical specialty focused on the heart and cardiovascular system."},
  {category:"Medical Terminology",q:"What does '-plasty' mean?",opts:["Removal","Inflammation","Surgical repair","Visual exam"],correct:2,explain:"-plasty = surgical repair/reconstruction. Rhinoplasty = nose repair. Arthroplasty = joint repair. Angioplasty = vessel repair."},
  {category:"Medical Terminology",q:"The root 'nephr-' refers to the:",opts:["Lung","Brain","Kidney","Nerve"],correct:2,explain:"Nephr- (Greek: nephros) = kidney. Nephritis = kidney inflammation. Nephrology = study of kidneys. Nephrectomy = kidney removal."},

  // ROUND 3 — Nutrition
  {category:"Nutrition",q:"Which macronutrient provides 9 calories per gram?",opts:["Carbohydrates","Protein","Fat","Fiber"],correct:2,explain:"Fat provides 9 cal/g — more than double carbs and protein (4 cal/g each). This is why fat-rich foods are calorie-dense."},
  {category:"Nutrition",q:"Vitamin C deficiency causes:",opts:["Rickets","Scurvy","Pellagra","Beriberi"],correct:1,explain:"Scurvy results from Vitamin C deficiency. Symptoms: bleeding gums, joint pain, fatigue, slow wound healing. Citrus fruits, peppers, and strawberries prevent it."},
  {category:"Nutrition",q:"The USDA's current food guidance tool is called:",opts:["Food Pyramid","MyPlate","Food Circle","Health Wheel"],correct:1,explain:"MyPlate (2011) replaced the old Food Pyramid. It shows 5 food groups proportioned on a dinner plate: fruits, vegetables, grains, protein, and dairy."},
  {category:"Nutrition",q:"Iron deficiency most commonly causes:",opts:["Scurvy","Rickets","Anemia","Osteoporosis"],correct:2,explain:"Iron-deficiency anemia — the most common nutritional deficiency worldwide. Iron is needed for hemoglobin, which carries oxygen in red blood cells."},
  {category:"Nutrition",q:"How many essential nutrients are there?",opts:["4","5","6","7"],correct:2,explain:"The 6 essential nutrients: Carbohydrates, Proteins, Fats, Vitamins, Minerals, and Water. The body cannot function without all 6."},

  // ROUND 4 — Health Careers
  {category:"Health Careers",q:"Which career pathway includes nurses, physicians, and physical therapists?",opts:["Diagnostic","Therapeutic","Health Informatics","Support Services"],correct:1,explain:"The Therapeutic pathway covers careers that change a patient's health status — treating, caring for, and rehabilitating patients."},
  {category:"Health Careers",q:"A phlebotomist's main job is:",opts:["Dispensing medications","Drawing blood samples","Reading X-rays","Physical therapy"],correct:1,explain:"Phlebotomists draw blood from patients for laboratory testing. It's an entry-level clinical career requiring a short certificate program."},
  {category:"Health Careers",q:"What does HIPAA protect?",opts:["Hospitals from lawsuits","Patient private health information","Healthcare worker wages","Insurance company profits"],correct:1,explain:"HIPAA (1996) protects the privacy and security of patients' protected health information (PHI). Violations carry significant fines."},
  {category:"Health Careers",q:"An MD and DO are both:",opts:["Identical with no differences","Fully licensed physicians who can diagnose, treat, and prescribe","Medical students still in training","Physician assistants"],correct:1,explain:"Both MDs and DOs are fully licensed physicians. DOs have additional training in osteopathic manipulative medicine but practice in all the same areas as MDs."},

  // ROUND 5 — Emergency/Safety
  {category:"Emergency Preparedness",q:"Adult CPR compression-to-breath ratio is:",opts:["15:2","20:2","25:2","30:2"],correct:3,explain:"30:2 is the standard adult CPR ratio — 30 compressions at 100-120/min (2-2.4 inches deep), then 2 rescue breaths."},
  {category:"Emergency Preparedness",q:"FAST stands for stroke warning signs. The 'S' stands for:",opts:["Sweating","Sensitivity","Speech (slurred or strange)","Stomach pain"],correct:2,explain:"FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 911. Slurred or strange speech is a key stroke warning sign."},
  {category:"Emergency Preparedness",q:"Anaphylaxis is treated immediately with:",opts:["Benadryl","Ice and elevation","Epinephrine (EpiPen)","Aspirin"],correct:2,explain:"Epinephrine is the ONLY first-line treatment for anaphylaxis. It rapidly reverses the allergic reaction. Call 911 even after using an EpiPen."},
  {category:"Emergency Preparedness",q:"For a severe burn, you should first:",opts:["Apply butter","Break blisters","Cool with cool running water 10-20 min","Apply ice directly"],correct:2,explain:"Cool running water (NOT ice) for 10-20 minutes is first aid for burns. Ice causes additional tissue damage."},

  // ROUND 6 — Healthy Living
  {category:"Healthy Living",q:"Daily physical activity recommendation for youth is:",opts:["20 minutes","30 minutes","45 minutes","60 minutes"],correct:3,explain:"60 minutes of moderate-to-vigorous activity daily is recommended for children and teens ages 6-17 by the Physical Activity Guidelines for Americans."},
  {category:"Healthy Living",q:"Teenagers need how many hours of sleep per night?",opts:["5-6","6-7","8-10","11-12"],correct:2,explain:"8-10 hours per night is recommended for teenagers. Sleep is essential for brain development, immunity, mental health, and academic performance."},
  {category:"Healthy Living",q:"Social determinants of health are best described as:",opts:["Genetic risk factors","Non-medical factors like income and education affecting health","Individual lifestyle choices only","Healthcare quality measures"],correct:1,explain:"Social determinants of health are conditions in environments where people live, work, and learn that affect health — income, education, housing, neighborhood, social support."},
  {category:"Healthy Living",q:"Which is a MODIFIABLE risk factor for chronic disease?",opts:["Age","Genetics","Smoking","Sex"],correct:2,explain:"Modifiable risk factors can be changed through choices and interventions — smoking, diet, physical activity, weight. Non-modifiable: age, genetics, sex, family history."},

  // ROUND 7 — Math/Measurements
  {category:"Math for Health",q:"Normal body temperature in Celsius is:",opts:["35°C","36°C","37°C","38°C"],correct:2,explain:"Normal body temperature is 37°C (98.6°F). Fever is defined as >38°C (100.4°F). Hypothermia is <35°C (95°F)."},
  {category:"Math for Health",q:"How many milligrams are in 1 gram?",opts:["10","100","1,000","10,000"],correct:2,explain:"1 gram = 1,000 milligrams. The prefix 'milli-' means 1/1,000. Most drug doses are measured in mg."},
  {category:"Math for Health",q:"Normal adult blood pressure is approximately:",opts:["100/60 mmHg","120/80 mmHg","140/90 mmHg","160/100 mmHg"],correct:1,explain:"120/80 mmHg is normal. 120 = systolic (heart pumping), 80 = diastolic (heart resting). Hypertension ≥ 130/80."},
  {category:"Math for Health",q:"1 kilogram equals approximately:",opts:["1.5 pounds","2.2 pounds","3.3 pounds","4.4 pounds"],correct:1,explain:"1 kg ≈ 2.2 lbs. To convert pounds to kg, divide by 2.2. Critical for weight-based drug dosing."},
  {category:"Math for Health",q:"Military time 1500 equals:",opts:["1:00 AM","3:00 AM","1:00 PM","3:00 PM"],correct:3,explain:"1500 military time = 3:00 PM. Subtract 1200 from times 1300-2359 to get PM. 1500 - 1200 = 3:00 PM."},
]
}; // end QB_HOSA_BOWL
