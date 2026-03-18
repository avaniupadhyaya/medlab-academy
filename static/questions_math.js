// HOSA Academy — Math for Health Careers Question Bank
// Based on 2025-2026 HOSA Middle School guidelines

window.QB_MATH = {

flashcards: {
easy: [
  {term:"Metric system",def:"International measurement system used in medicine (meters, liters, grams)",breakdown:"Based on powers of 10; used worldwide in healthcare"},
  {term:"Kilogram (kg)",def:"1,000 grams; base unit of mass in metric system",breakdown:"1 kg = 2.2 pounds"},
  {term:"Milligram (mg)",def:"1/1,000 of a gram; common unit for drug dosages",breakdown:"1 gram = 1,000 mg"},
  {term:"Microgram (mcg/µg)",def:"1/1,000,000 of a gram; used for very potent medications",breakdown:"1 mg = 1,000 mcg"},
  {term:"Milliliter (mL)",def:"1/1,000 of a liter; used for liquid medications",breakdown:"1 mL = 1 cc (cubic centimeter)"},
  {term:"Liter (L)",def:"Base unit of volume in metric system",breakdown:"1 L = 1,000 mL; slightly more than 1 quart"},
  {term:"Celsius to Fahrenheit",def:"°F = (°C × 9/5) + 32",breakdown:"Normal body temp: 37°C = 98.6°F"},
  {term:"Fahrenheit to Celsius",def:"°C = (°F - 32) × 5/9",breakdown:"Water freezes: 0°C = 32°F; boils: 100°C = 212°F"},
  {term:"Normal body temperature",def:"98.6°F (37°C)",breakdown:"Fever: >100.4°F (38°C)"},
  {term:"Normal heart rate (adult)",def:"60-100 beats per minute (bpm)",breakdown:"Bradycardia: <60 bpm; Tachycardia: >100 bpm"},
  {term:"Normal blood pressure",def:"120/80 mmHg (systolic/diastolic)",breakdown:"Hypertension: ≥130/80; Hypotension: <90/60"},
  {term:"Normal respiratory rate",def:"12-20 breaths per minute (adults)",breakdown:"Tachypnea: >20; Bradypnea: <12"},
  {term:"Normal O2 saturation",def:"95-100% (SpO2)",breakdown:"Below 90% is critically low — needs oxygen"},
  {term:"Pound to kilogram",def:"1 lb = 0.454 kg; OR divide pounds by 2.2",breakdown:"Example: 110 lbs ÷ 2.2 = 50 kg"},
  {term:"Tablespoon (tbsp)",def:"15 mL in metric equivalent",breakdown:"3 teaspoons = 1 tablespoon = 15 mL"},
],
medium: [
  {term:"Dosage calculation formula",def:"Dose = (Desired dose ÷ Dose on hand) × Volume",breakdown:"D/H × V = Amount to give"},
  {term:"Drop factor (gtts)",def:"Number of drops per mL from IV tubing set",breakdown:"Macro drip: 10, 15, or 20 gtts/mL; Micro drip: 60 gtts/mL"},
  {term:"IV flow rate formula",def:"Flow rate (mL/hr) = Total volume (mL) ÷ Time (hours)",breakdown:"Example: 1000 mL over 8 hours = 125 mL/hr"},
  {term:"BMI formula",def:"BMI = Weight (kg) ÷ Height² (m²)",breakdown:"Or: BMI = 703 × weight(lbs) ÷ height(in)²"},
  {term:"Percent solution",def:"Grams of solute per 100 mL of solution",breakdown:"5% dextrose = 5g glucose per 100 mL"},
  {term:"Ratio",def:"Relationship between two numbers; used in medication concentrations",breakdown:"1:1000 epinephrine = 1g per 1000 mL"},
  {term:"Proportion",def:"Two equal ratios; used to solve dosage calculations",breakdown:"If 1 tab = 250 mg, how many tabs for 500 mg? 2 tabs"},
  {term:"Mean (average)",def:"Sum of all values ÷ number of values",breakdown:"BP readings: 120+130+125 ÷ 3 = 125 mmHg"},
  {term:"Metric prefixes",def:"Kilo(k)=1000, Centi(c)=1/100, Milli(m)=1/1000, Micro(µ)=1/1,000,000",breakdown:"King Henry Died Monday Drinking Cold Milk (mnemonic)"},
  {term:"Roman numerals in medicine",def:"I=1, V=5, X=10, L=50, C=100",breakdown:"ss=½, i=1, ii=2, iii=3, iv=4, vi=6"},
  {term:"24-hour clock (military time)",def:"Time without AM/PM; 0000-2359",breakdown:"1300 = 1:00 PM; 2100 = 9:00 PM; 0830 = 8:30 AM"},
  {term:"Apothecary system",def:"Older measurement system; grains, drams, ounces",breakdown:"1 grain (gr) = 60-65 mg; still seen on some Rx"},
  {term:"Household measurements",def:"Teaspoon (5mL), Tablespoon (15mL), Cup (240mL), Pint (480mL)",breakdown:"Used for patient instructions at home"},
  {term:"Pediatric weight dosing",def:"Most pediatric doses calculated per kilogram (mg/kg)",breakdown:"Example: 10 mg/kg × 25 kg child = 250 mg"},
  {term:"Safe dose range",def:"Minimum and maximum therapeutic dose per kg body weight",breakdown:"Always verify calculated dose is within safe range"},
],
hard: []
},

quiz: {
easy: [
  {q:"Normal adult body temperature in Fahrenheit is:",opts:["97.6°F","98.6°F","99.6°F","100.4°F"],correct:1,explain:"Normal body temperature is 98.6°F (37°C). A temperature above 100.4°F (38°C) is considered a fever (pyrexia)."},
  {q:"Normal adult heart rate range is:",opts:["40-60 bpm","60-100 bpm","100-120 bpm","50-80 bpm"],correct:1,explain:"Normal heart rate is 60-100 bpm. Below 60 = bradycardia; above 100 = tachycardia."},
  {q:"How many milligrams (mg) are in 1 gram (g)?",opts:["10 mg","100 mg","1,000 mg","10,000 mg"],correct:2,explain:"1 gram = 1,000 milligrams. The prefix 'milli-' means 1/1,000. This is critical for medication dosing."},
  {q:"How many milliliters (mL) are in 1 liter (L)?",opts:["10 mL","100 mL","500 mL","1,000 mL"],correct:3,explain:"1 liter = 1,000 milliliters. The prefix 'milli-' means 1/1,000. 1 mL also equals 1 cc (cubic centimeter)."},
  {q:"1 kilogram equals approximately how many pounds?",opts:["1.5 lbs","2.2 lbs","3.3 lbs","4.4 lbs"],correct:1,explain:"1 kilogram ≈ 2.2 pounds. To convert lbs to kg, divide by 2.2. To convert kg to lbs, multiply by 2.2."},
  {q:"Normal blood pressure is:",opts:["80/60 mmHg","100/70 mmHg","120/80 mmHg","140/90 mmHg"],correct:2,explain:"Normal blood pressure is 120/80 mmHg. 120 = systolic (heart contracting); 80 = diastolic (heart relaxing). Hypertension ≥ 130/80."},
  {q:"Normal O2 saturation (SpO2) range is:",opts:["85-90%","90-94%","95-100%","100% only"],correct:2,explain:"Normal SpO2 is 95-100%. Below 90% is critically low and requires immediate oxygen therapy. Measured by pulse oximeter."},
  {q:"How many teaspoons equal 1 tablespoon?",opts:["2 teaspoons","3 teaspoons","4 teaspoons","5 teaspoons"],correct:1,explain:"3 teaspoons = 1 tablespoon = 15 mL. Important for liquid medication instructions given to patients."},
  {q:"Convert 37°C to Fahrenheit using °F = (°C × 9/5) + 32:",opts:["96.8°F","97.6°F","98.6°F","99.6°F"],correct:2,explain:"(37 × 9/5) + 32 = (37 × 1.8) + 32 = 66.6 + 32 = 98.6°F. This confirms normal body temp = 37°C = 98.6°F."},
  {q:"Normal adult respiratory rate is:",opts:["6-10 breaths/min","12-20 breaths/min","20-30 breaths/min","25-35 breaths/min"],correct:1,explain:"Normal respiratory rate is 12-20 breaths per minute. Tachypnea (>20) may indicate respiratory distress; bradypnea (<12) may indicate drug overdose or neurological issues."},
  {q:"A patient weighs 154 pounds. What is their weight in kilograms? (Divide lbs by 2.2)",opts:["60 kg","70 kg","80 kg","90 kg"],correct:1,explain:"154 ÷ 2.2 = 70 kg. Converting weight to kg is essential in healthcare because most drug doses are calculated per kilogram."},
  {q:"Military time of 1400 equals:",opts:["2:00 AM","12:00 PM","2:00 PM","4:00 PM"],correct:2,explain:"Military time uses a 24-hour clock. 1400 = 2:00 PM. Subtract 1200 from any number 1300-2359 to get PM time. 0800 = 8:00 AM (no change for AM)."},
],
medium: [
  {q:"A physician orders 500 mg of a medication. The stock on hand is 250 mg tablets. How many tablets should be given?",opts:["0.5 tablet","1 tablet","2 tablets","4 tablets"],correct:2,explain:"Desired (500 mg) ÷ On Hand (250 mg) × Volume (1 tablet) = 2 tablets. This is the basic D/H×V formula for dosage calculations."},
  {q:"IV order: 1,000 mL normal saline over 8 hours. What is the flow rate in mL/hr?",opts:["100 mL/hr","125 mL/hr","150 mL/hr","200 mL/hr"],correct:1,explain:"1,000 mL ÷ 8 hours = 125 mL/hr. This is the basic IV rate calculation: Volume ÷ Time = Rate."},
  {q:"A child weighs 44 pounds. Their weight in kg is: (44 ÷ 2.2)",opts:["15 kg","20 kg","22 kg","25 kg"],correct:1,explain:"44 ÷ 2.2 = 20 kg. Pediatric dosing is almost always weight-based (mg/kg), so accurate weight conversion is critical."},
  {q:"The doctor orders amoxicillin 25 mg/kg/day for a 20 kg child. What is the total daily dose?",opts:["250 mg","500 mg","1,000 mg","2,000 mg"],correct:1,explain:"25 mg/kg × 20 kg = 500 mg total daily dose. This is mg/kg pediatric dosing — multiply the dose per kg by the child's weight in kg."},
  {q:"Convert 39°C to Fahrenheit: °F = (°C × 9/5) + 32",opts:["100.2°F","101.0°F","102.2°F","103.0°F"],correct:2,explain:"(39 × 1.8) + 32 = 70.2 + 32 = 102.2°F. 39°C is a significant fever. Normal is 37°C/98.6°F; fever threshold is 38°C/100.4°F."},
  {q:"A patient's BP readings over 3 days: 128, 132, 124. What is the mean (average) blood pressure?",opts:["124 mmHg","128 mmHg","130 mmHg","132 mmHg"],correct:1,explain:"(128 + 132 + 124) ÷ 3 = 384 ÷ 3 = 128 mmHg. Mean is the average — add all values, divide by the count."},
  {q:"How many micrograms (mcg) are in 1 milligram (mg)?",opts:["10 mcg","100 mcg","1,000 mcg","10,000 mcg"],correct:2,explain:"1 mg = 1,000 mcg (micrograms). 'Micro-' means 1/1,000,000 of the base unit. Very potent drugs like levothyroxine (thyroid) are measured in mcg."},
  {q:"A 5% dextrose solution means:",opts:["5 mg of glucose per 100 mL","5 g of glucose per 100 mL","5 g of glucose per liter","50 g of glucose per 100 mL"],correct:1,explain:"Percent solution = grams of solute per 100 mL. 5% D5W = 5 grams of dextrose (glucose) per 100 mL of solution."},
  {q:"Convert 102°F to Celsius: °C = (°F - 32) × 5/9",opts:["37.5°C","38.1°C","38.9°C","39.5°C"],correct:2,explain:"(102 - 32) × 5/9 = 70 × 5/9 = 350/9 ≈ 38.9°C. This is a significant fever. Always know both scales — medical documentation uses Celsius, patients often report in Fahrenheit."},
  {q:"An IV is ordered at 75 mL/hr. How many mL will infuse over 6 hours?",opts:["300 mL","375 mL","450 mL","600 mL"],correct:2,explain:"75 mL/hr × 6 hours = 450 mL. Rate × Time = Volume. Used to track fluid intake and plan IV bag changes."},
  {q:"A medication label reads '250 mg per 5 mL'. The doctor orders 500 mg. How many mL should be given?",opts:["5 mL","7.5 mL","10 mL","12.5 mL"],correct:2,explain:"Desired (500 mg) ÷ On Hand (250 mg) × Volume (5 mL) = 10 mL. D/H × V = 500/250 × 5 = 2 × 5 = 10 mL."},
  {q:"Military time 0030 equals:",opts:["12:30 AM","12:30 PM","0:30 AM","3:00 AM"],correct:0,explain:"0030 in military time = 12:30 AM. Midnight is 0000; 0030 is 30 minutes after midnight. Military time avoids AM/PM confusion in medical records."},
]
}

}; // end QB_MATH
