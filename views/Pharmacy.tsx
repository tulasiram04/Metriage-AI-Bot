import React, { useState } from 'react';
import {
  Search,
  X,
  Bot,
  AlertTriangle,
  Send,
  CheckCircle,
  FileText,
  Pill
} from '../components/Icons';
import { Button } from '../components/Button';
import { AlertModal } from '../components/AlertModal';
import { Orders } from './Orders';

/* ---------------- TYPES ---------------- */
export interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  requiresPrescription: boolean;
  use: string;
  description: string;
  manufacturer: string;
  stripQuantity: string;
  regulatoryBadge: 'OTC' | 'ScheduleH' | 'ScheduleH1';
}

/* ---------------- SAMPLE DATA ---------------- */
export const MEDICINES: Medicine[] = [
  // Fever & Pain (10)
  {
    id: '1',
    name: 'Dolo 650',
    category: 'Fever & Pain',
    price: 30,
    inStock: true,
    requiresPrescription: false,
    use: 'Fever & Pain',
    description: 'Paracetamol 650mg for fever and pain relief.',
    manufacturer: 'Micro Labs',
    stripQuantity: '15 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '2',
    name: 'Crocin 500',
    category: 'Fever & Pain',
    price: 25,
    inStock: true,
    requiresPrescription: false,
    use: 'Fever & Pain',
    description: 'Paracetamol 500mg for fever and pain.',
    manufacturer: 'GSK',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '3',
    name: 'Saridon',
    category: 'Fever & Pain',
    price: 35,
    inStock: false,
    requiresPrescription: false,
    use: 'Headache & Pain',
    description: 'Paracetamol, propyphenazone, caffeine for headache.',
    manufacturer: 'Piramal',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '4',
    name: 'Combiflam',
    category: 'Fever & Pain',
    price: 45,
    inStock: true,
    requiresPrescription: false,
    use: 'Pain Relief',
    description: 'Ibuprofen and paracetamol combination.',
    manufacturer: 'Sanofi',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '5',
    name: 'Brufen 400',
    category: 'Fever & Pain',
    price: 50,
    inStock: true,
    requiresPrescription: false,
    use: 'Pain & Inflammation',
    description: 'Ibuprofen 400mg for pain and inflammation.',
    manufacturer: 'Abbott',
    stripQuantity: '15 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '6',
    name: 'Voveran 50',
    category: 'Fever & Pain',
    price: 40,
    inStock: false,
    requiresPrescription: false,
    use: 'Pain Relief',
    description: 'Diclofenac sodium for pain relief.',
    manufacturer: 'Novartis',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '7',
    name: 'Nimesulide 100',
    category: 'Fever & Pain',
    price: 35,
    inStock: true,
    requiresPrescription: false,
    use: 'Pain & Fever',
    description: 'Nimesulide for pain and fever.',
    manufacturer: 'Dr Reddy\'s',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '8',
    name: 'Aceclofenac 100',
    category: 'Fever & Pain',
    price: 55,
    inStock: true,
    requiresPrescription: false,
    use: 'Pain Relief',
    description: 'Aceclofenac for pain and inflammation.',
    manufacturer: 'Intas',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '9',
    name: 'Tramadol 50',
    category: 'Fever & Pain',
    price: 80,
    inStock: false,
    requiresPrescription: true,
    use: 'Severe Pain',
    description: 'Tramadol for moderate to severe pain.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '10',
    name: 'Paracetamol 500',
    category: 'Fever & Pain',
    price: 20,
    inStock: true,
    requiresPrescription: false,
    use: 'Fever & Pain',
    description: 'Basic paracetamol for fever and pain.',
    manufacturer: 'Cipla',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },

  // Antibiotics (10)
  {
    id: '11',
    name: 'Azithral 500',
    category: 'Antibiotics',
    price: 120,
    inStock: false,
    requiresPrescription: true,
    use: 'Bacterial Infection',
    description: 'Azithromycin antibiotic tablet.',
    manufacturer: 'Alembic',
    stripQuantity: '5 Tablets',
    regulatoryBadge: 'ScheduleH1'
  },
  {
    id: '12',
    name: 'Amoxicillin 500',
    category: 'Antibiotics',
    price: 80,
    inStock: true,
    requiresPrescription: true,
    use: 'Bacterial Infection',
    description: 'Amoxicillin for bacterial infections.',
    manufacturer: 'Cipla',
    stripQuantity: '10 Capsules',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '13',
    name: 'Ciprofloxacin 500',
    category: 'Antibiotics',
    price: 90,
    inStock: true,
    requiresPrescription: true,
    use: 'Urinary Tract Infection',
    description: 'Ciprofloxacin for UTI and other infections.',
    manufacturer: 'Ranbaxy',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '14',
    name: 'Ofloxacin 200',
    category: 'Antibiotics',
    price: 70,
    inStock: false,
    requiresPrescription: true,
    use: 'Bacterial Infection',
    description: 'Ofloxacin for bacterial infections.',
    manufacturer: 'Zydus',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '15',
    name: 'Levofloxacin 500',
    category: 'Antibiotics',
    price: 150,
    inStock: true,
    requiresPrescription: true,
    use: 'Respiratory Infection',
    description: 'Levofloxacin for respiratory infections.',
    manufacturer: 'Dr Reddy\'s',
    stripQuantity: '5 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '16',
    name: 'Cefixime 200',
    category: 'Antibiotics',
    price: 100,
    inStock: true,
    requiresPrescription: true,
    use: 'Throat Infection',
    description: 'Cefixime for throat and ear infections.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '17',
    name: 'Doxycycline 100',
    category: 'Antibiotics',
    price: 85,
    inStock: false,
    requiresPrescription: true,
    use: 'Skin Infection',
    description: 'Doxycycline for skin and acne infections.',
    manufacturer: 'Cadila',
    stripQuantity: '10 Capsules',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '18',
    name: 'Erythromycin 250',
    category: 'Antibiotics',
    price: 95,
    inStock: true,
    requiresPrescription: true,
    use: 'Skin Infection',
    description: 'Erythromycin for skin infections.',
    manufacturer: 'Abbott',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '19',
    name: 'Clindamycin 300',
    category: 'Antibiotics',
    price: 120,
    inStock: true,
    requiresPrescription: true,
    use: 'Skin & Dental Infection',
    description: 'Clindamycin for skin and dental infections.',
    manufacturer: 'Piramal',
    stripQuantity: '10 Capsules',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '20',
    name: 'Metronidazole 400',
    category: 'Antibiotics',
    price: 60,
    inStock: true,
    requiresPrescription: true,
    use: 'Parasitic Infection',
    description: 'Metronidazole for parasitic infections.',
    manufacturer: 'Alkem',
    stripQuantity: '15 Tablets',
    regulatoryBadge: 'ScheduleH'
  },

  // Diabetes Care (10)
  {
    id: '21',
    name: 'Metformin 500',
    category: 'Diabetes Care',
    price: 40,
    inStock: true,
    requiresPrescription: true,
    use: 'Blood Sugar Control',
    description: 'Metformin for type 2 diabetes.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '22',
    name: 'Glimepiride 2mg',
    category: 'Diabetes Care',
    price: 55,
    inStock: true,
    requiresPrescription: true,
    use: 'Blood Sugar Control',
    description: 'Glimepiride for diabetes management.',
    manufacturer: 'Sanofi',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '23',
    name: 'Pioglitazone 15',
    category: 'Diabetes Care',
    price: 80,
    inStock: false,
    requiresPrescription: true,
    use: 'Insulin Sensitivity',
    description: 'Pioglitazone for diabetes.',
    manufacturer: 'USV',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '24',
    name: 'Sitagliptin 50',
    category: 'Diabetes Care',
    price: 120,
    inStock: true,
    requiresPrescription: true,
    use: 'Blood Sugar Control',
    description: 'Sitagliptin for type 2 diabetes.',
    manufacturer: 'MSD',
    stripQuantity: '7 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '25',
    name: 'Vildagliptin 50',
    category: 'Diabetes Care',
    price: 110,
    inStock: true,
    requiresPrescription: true,
    use: 'Blood Sugar Control',
    description: 'Vildagliptin for diabetes.',
    manufacturer: 'Novartis',
    stripQuantity: '15 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '26',
    name: 'Teneligliptin 20',
    category: 'Diabetes Care',
    price: 95,
    inStock: false,
    requiresPrescription: true,
    use: 'Blood Sugar Control',
    description: 'Teneligliptin for diabetes.',
    manufacturer: 'Glenmark',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '27',
    name: 'Acarbose 50',
    category: 'Diabetes Care',
    price: 70,
    inStock: true,
    requiresPrescription: true,
    use: 'Blood Sugar Control',
    description: 'Acarbose for diabetes.',
    manufacturer: 'Bayer',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '28',
    name: 'Repaglinide 1mg',
    category: 'Diabetes Care',
    price: 85,
    inStock: true,
    requiresPrescription: true,
    use: 'Blood Sugar Control',
    description: 'Repaglinide for diabetes.',
    manufacturer: 'Dr Reddy\'s',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '29',
    name: 'Gliclazide 80',
    category: 'Diabetes Care',
    price: 50,
    inStock: true,
    requiresPrescription: true,
    use: 'Blood Sugar Control',
    description: 'Gliclazide for diabetes.',
    manufacturer: 'Servier',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '30',
    name: 'Linagliptin 5',
    category: 'Diabetes Care',
    price: 130,
    inStock: false,
    requiresPrescription: true,
    use: 'Blood Sugar Control',
    description: 'Linagliptin for diabetes.',
    manufacturer: 'Boehringer',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },

  // BP & Heart (10)
  {
    id: '31',
    name: 'Amlodipine 5',
    category: 'BP & Heart',
    price: 45,
    inStock: true,
    requiresPrescription: true,
    use: 'Blood Pressure',
    description: 'Amlodipine for hypertension.',
    manufacturer: 'Pfizer',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '32',
    name: 'Losartan 50',
    category: 'BP & Heart',
    price: 60,
    inStock: true,
    requiresPrescription: true,
    use: 'Blood Pressure',
    description: 'Losartan for hypertension.',
    manufacturer: 'MSD',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '33',
    name: 'Telmisartan 40',
    category: 'BP & Heart',
    price: 75,
    inStock: false,
    requiresPrescription: true,
    use: 'Blood Pressure',
    description: 'Telmisartan for hypertension.',
    manufacturer: 'Boehringer',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '34',
    name: 'Metoprolol 50',
    category: 'BP & Heart',
    price: 40,
    inStock: true,
    requiresPrescription: true,
    use: 'Heart Rate Control',
    description: 'Metoprolol for heart conditions.',
    manufacturer: 'AstraZeneca',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '35',
    name: 'Atenolol 50',
    category: 'BP & Heart',
    price: 35,
    inStock: true,
    requiresPrescription: true,
    use: 'Blood Pressure',
    description: 'Atenolol for hypertension.',
    manufacturer: 'Cipla',
    stripQuantity: '14 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '36',
    name: 'Enalapril 5',
    category: 'BP & Heart',
    price: 50,
    inStock: true,
    requiresPrescription: true,
    use: 'Blood Pressure',
    description: 'Enalapril for hypertension.',
    manufacturer: 'Dr Reddy\'s',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '37',
    name: 'Ramipril 5',
    category: 'BP & Heart',
    price: 55,
    inStock: false,
    requiresPrescription: true,
    use: 'Blood Pressure',
    description: 'Ramipril for hypertension.',
    manufacturer: 'Sanofi',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '38',
    name: 'Bisoprolol 5',
    category: 'BP & Heart',
    price: 65,
    inStock: true,
    requiresPrescription: true,
    use: 'Heart Rate Control',
    description: 'Bisoprolol for heart conditions.',
    manufacturer: 'Merck',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '39',
    name: 'Carvedilol 6.25',
    category: 'BP & Heart',
    price: 70,
    inStock: true,
    requiresPrescription: true,
    use: 'Heart Failure',
    description: 'Carvedilol for heart failure.',
    manufacturer: 'GSK',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '40',
    name: 'Furosemide 40',
    category: 'BP & Heart',
    price: 25,
    inStock: true,
    requiresPrescription: true,
    use: 'Diuretic',
    description: 'Furosemide for fluid retention.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },

  // Vitamins & Supplements (10)
  {
    id: '41',
    name: 'Vitamin D3 60K',
    category: 'Vitamins & Supplements',
    price: 90,
    inStock: true,
    requiresPrescription: false,
    use: 'Bone Health',
    description: 'Vitamin D3 for bone health.',
    manufacturer: 'USV',
    stripQuantity: '4 Capsules',
    regulatoryBadge: 'OTC'
  },
  {
    id: '42',
    name: 'Vitamin B Complex',
    category: 'Vitamins & Supplements',
    price: 65,
    inStock: true,
    requiresPrescription: false,
    use: 'Energy & Nervous System',
    description: 'B complex vitamins for energy.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '15 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '43',
    name: 'Calcium Citrate 500',
    category: 'Vitamins & Supplements',
    price: 75,
    inStock: true,
    requiresPrescription: false,
    use: 'Bone Health',
    description: 'Calcium for bone health.',
    manufacturer: 'Cipla',
    stripQuantity: '15 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '44',
    name: 'Iron Folic Acid',
    category: 'Vitamins & Supplements',
    price: 55,
    inStock: false,
    requiresPrescription: false,
    use: 'Anemia Prevention',
    description: 'Iron and folic acid for anemia.',
    manufacturer: 'Dr Reddy\'s',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '45',
    name: 'Multivitamin Tablets',
    category: 'Vitamins & Supplements',
    price: 120,
    inStock: true,
    requiresPrescription: false,
    use: 'Overall Health',
    description: 'Complete multivitamin supplement.',
    manufacturer: 'Centrum',
    stripQuantity: '15 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '46',
    name: 'Omega 3 Fish Oil',
    category: 'Vitamins & Supplements',
    price: 150,
    inStock: true,
    requiresPrescription: false,
    use: 'Heart Health',
    description: 'Omega 3 for heart health.',
    manufacturer: 'Carlson',
    stripQuantity: '30 Softgels',
    regulatoryBadge: 'OTC'
  },
  {
    id: '47',
    name: 'Vitamin C 500',
    category: 'Vitamins & Supplements',
    price: 40,
    inStock: true,
    requiresPrescription: false,
    use: 'Immunity',
    description: 'Vitamin C for immunity.',
    manufacturer: 'GSK',
    stripQuantity: '15 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '48',
    name: 'Zinc 50mg',
    category: 'Vitamins & Supplements',
    price: 35,
    inStock: false,
    requiresPrescription: false,
    use: 'Immunity',
    description: 'Zinc for immune support.',
    manufacturer: 'Intas',
    stripQuantity: '15 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '49',
    name: 'Magnesium 250',
    category: 'Vitamins & Supplements',
    price: 60,
    inStock: true,
    requiresPrescription: false,
    use: 'Muscle Function',
    description: 'Magnesium for muscle and nerve function.',
    manufacturer: 'Alkem',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '50',
    name: 'Probiotics',
    category: 'Vitamins & Supplements',
    price: 180,
    inStock: true,
    requiresPrescription: false,
    use: 'Gut Health',
    description: 'Probiotics for digestive health.',
    manufacturer: 'Danone',
    stripQuantity: '10 Capsules',
    regulatoryBadge: 'OTC'
  },

  // Cold & Cough (8)
  {
    id: '51',
    name: 'Cough Syrup',
    category: 'Cold & Cough',
    price: 85,
    inStock: true,
    requiresPrescription: false,
    use: 'Cough Relief',
    description: 'Syrup for cough and throat irritation.',
    manufacturer: 'Cipla',
    stripQuantity: '100ml Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '52',
    name: 'Paracetamol + Phenylephrine',
    category: 'Cold & Cough',
    price: 45,
    inStock: true,
    requiresPrescription: false,
    use: 'Cold & Fever',
    description: 'Combination for cold symptoms and fever.',
    manufacturer: 'GSK',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '53',
    name: 'Cetirizine 10mg',
    category: 'Cold & Cough',
    price: 25,
    inStock: true,
    requiresPrescription: false,
    use: 'Allergy Relief',
    description: 'Antihistamine for allergies and cold.',
    manufacturer: 'Dr Reddy\'s',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '54',
    name: 'Ambroxol 30mg',
    category: 'Cold & Cough',
    price: 35,
    inStock: false,
    requiresPrescription: false,
    use: 'Cough & Mucus',
    description: 'Mucolytic for cough with mucus.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '55',
    name: 'Levocetirizine 5mg',
    category: 'Cold & Cough',
    price: 40,
    inStock: true,
    requiresPrescription: false,
    use: 'Allergy & Cold',
    description: 'Advanced antihistamine for allergies.',
    manufacturer: 'Alembic',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '56',
    name: 'Guaifenesin 100mg',
    category: 'Cold & Cough',
    price: 30,
    inStock: true,
    requiresPrescription: false,
    use: 'Chest Congestion',
    description: 'Expectorant for chest congestion.',
    manufacturer: 'Intas',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '57',
    name: 'Dextromethorphan 15mg',
    category: 'Cold & Cough',
    price: 50,
    inStock: true,
    requiresPrescription: false,
    use: 'Dry Cough',
    description: 'Cough suppressant for dry cough.',
    manufacturer: 'Cadila',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '58',
    name: 'Nasal Spray',
    category: 'Cold & Cough',
    price: 120,
    inStock: false,
    requiresPrescription: false,
    use: 'Nasal Congestion',
    description: 'Saline nasal spray for congestion.',
    manufacturer: 'Cipla',
    stripQuantity: '10ml Bottle',
    regulatoryBadge: 'OTC'
  },

  // Stomach Care (8)
  {
    id: '59',
    name: 'Pantoprazole 40',
    category: 'Stomach Care',
    price: 65,
    inStock: true,
    requiresPrescription: true,
    use: 'Acid Reflux',
    description: 'PPI for acid reflux and ulcers.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '60',
    name: 'Ranitidine 150',
    category: 'Stomach Care',
    price: 25,
    inStock: true,
    requiresPrescription: false,
    use: 'Heartburn',
    description: 'H2 blocker for heartburn.',
    manufacturer: 'Cipla',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '61',
    name: 'Domperidone 10',
    category: 'Stomach Care',
    price: 30,
    inStock: true,
    requiresPrescription: false,
    use: 'Nausea & Vomiting',
    description: 'Antiemetic for nausea.',
    manufacturer: 'Dr Reddy\'s',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '62',
    name: 'Ondansetron 4mg',
    category: 'Stomach Care',
    price: 45,
    inStock: false,
    requiresPrescription: true,
    use: 'Severe Nausea',
    description: 'Antiemetic for chemotherapy nausea.',
    manufacturer: 'GSK',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '63',
    name: 'Loperamide 2mg',
    category: 'Stomach Care',
    price: 20,
    inStock: true,
    requiresPrescription: false,
    use: 'Diarrhea',
    description: 'Antidiarrheal for loose motions.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '64',
    name: 'Mebeverine 135',
    category: 'Stomach Care',
    price: 55,
    inStock: true,
    requiresPrescription: false,
    use: 'IBS Relief',
    description: 'Antispasmodic for IBS.',
    manufacturer: 'Alembic',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '65',
    name: 'Sucralfate 1g',
    category: 'Stomach Care',
    price: 75,
    inStock: true,
    requiresPrescription: true,
    use: 'Ulcer Healing',
    description: 'Protects stomach lining.',
    manufacturer: 'Cadila',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '66',
    name: 'Esomeprazole 40',
    category: 'Stomach Care',
    price: 80,
    inStock: false,
    requiresPrescription: true,
    use: 'Acid Reflux',
    description: 'PPI for severe acid reflux.',
    manufacturer: 'AstraZeneca',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },

  // Skin Care (8)
  {
    id: '67',
    name: 'Betamethasone Cream',
    category: 'Skin Care',
    price: 35,
    inStock: true,
    requiresPrescription: false,
    use: 'Skin Inflammation',
    description: 'Steroid cream for skin conditions.',
    manufacturer: 'GSK',
    stripQuantity: '20g Tube',
    regulatoryBadge: 'OTC'
  },
  {
    id: '68',
    name: 'Clotrimazole Cream',
    category: 'Skin Care',
    price: 40,
    inStock: true,
    requiresPrescription: false,
    use: 'Fungal Infections',
    description: 'Antifungal cream for skin infections.',
    manufacturer: 'Cipla',
    stripQuantity: '15g Tube',
    regulatoryBadge: 'OTC'
  },
  {
    id: '69',
    name: 'Permethrin Cream',
    category: 'Skin Care',
    price: 120,
    inStock: false,
    requiresPrescription: true,
    use: 'Scabies Treatment',
    description: 'Treatment for scabies.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '30g Tube',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '70',
    name: 'Hydroquinone Cream',
    category: 'Skin Care',
    price: 150,
    inStock: true,
    requiresPrescription: true,
    use: 'Skin Lightening',
    description: 'Cream for hyperpigmentation.',
    manufacturer: 'Abbott',
    stripQuantity: '20g Tube',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '71',
    name: 'Salicylic Acid 2%',
    category: 'Skin Care',
    price: 25,
    inStock: true,
    requiresPrescription: false,
    use: 'Acne Treatment',
    description: 'For acne and oily skin.',
    manufacturer: 'Dr Reddy\'s',
    stripQuantity: '50ml Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '72',
    name: 'Ketoconazole Shampoo',
    category: 'Skin Care',
    price: 85,
    inStock: true,
    requiresPrescription: false,
    use: 'Dandruff Treatment',
    description: 'Antifungal shampoo for dandruff.',
    manufacturer: 'Cipla',
    stripQuantity: '100ml Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '73',
    name: 'Moisturizing Lotion',
    category: 'Skin Care',
    price: 60,
    inStock: true,
    requiresPrescription: false,
    use: 'Skin Hydration',
    description: 'Daily moisturizer for dry skin.',
    manufacturer: 'Himalaya',
    stripQuantity: '100ml Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '74',
    name: 'Sunscreen Lotion SPF 50',
    category: 'Skin Care',
    price: 95,
    inStock: false,
    requiresPrescription: false,
    use: 'Sun Protection',
    description: 'Broad spectrum sunscreen.',
    manufacturer: 'Lakme',
    stripQuantity: '50ml Bottle',
    regulatoryBadge: 'OTC'
  },

  // Eye & Ear Care (7)
  {
    id: '75',
    name: 'Ciprofloxacin Eye Drops',
    category: 'Eye & Ear Care',
    price: 45,
    inStock: true,
    requiresPrescription: true,
    use: 'Eye Infection',
    description: 'Antibiotic eye drops.',
    manufacturer: 'Cipla',
    stripQuantity: '5ml Bottle',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '76',
    name: 'Tobramycin Eye Drops',
    category: 'Eye & Ear Care',
    price: 50,
    inStock: true,
    requiresPrescription: true,
    use: 'Bacterial Eye Infection',
    description: 'Antibiotic for eye infections.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '5ml Bottle',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '77',
    name: 'Artificial Tears',
    category: 'Eye & Ear Care',
    price: 35,
    inStock: true,
    requiresPrescription: false,
    use: 'Dry Eyes',
    description: 'Lubricating eye drops.',
    manufacturer: 'Allergan',
    stripQuantity: '10ml Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '78',
    name: 'Ofloxacin Ear Drops',
    category: 'Eye & Ear Care',
    price: 40,
    inStock: false,
    requiresPrescription: true,
    use: 'Ear Infection',
    description: 'Antibiotic ear drops.',
    manufacturer: 'Cipla',
    stripQuantity: '5ml Bottle',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '79',
    name: 'Chloramphenicol Eye Ointment',
    category: 'Eye & Ear Care',
    price: 25,
    inStock: true,
    requiresPrescription: true,
    use: 'Eye Infection',
    description: 'Antibiotic eye ointment.',
    manufacturer: 'GSK',
    stripQuantity: '4g Tube',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '80',
    name: 'Boric Acid Ear Drops',
    category: 'Eye & Ear Care',
    price: 20,
    inStock: true,
    requiresPrescription: false,
    use: 'Ear Wax Removal',
    description: 'For ear cleaning.',
    manufacturer: 'Dr Reddy\'s',
    stripQuantity: '10ml Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '81',
    name: 'Contact Lens Solution',
    category: 'Eye & Ear Care',
    price: 75,
    inStock: true,
    requiresPrescription: false,
    use: 'Lens Cleaning',
    description: 'Multipurpose contact lens solution.',
    manufacturer: 'Bausch & Lomb',
    stripQuantity: '120ml Bottle',
    regulatoryBadge: 'OTC'
  },

  // Women Care (8)
  {
    id: '82',
    name: 'Folic Acid 5mg',
    category: 'Women Care',
    price: 30,
    inStock: true,
    requiresPrescription: false,
    use: 'Pregnancy Support',
    description: 'Folic acid for pregnancy.',
    manufacturer: 'Cipla',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '83',
    name: 'Iron Tablets',
    category: 'Women Care',
    price: 45,
    inStock: true,
    requiresPrescription: false,
    use: 'Anemia Prevention',
    description: 'Iron supplement for women.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '84',
    name: 'Calcium + Vitamin D3',
    category: 'Women Care',
    price: 65,
    inStock: true,
    requiresPrescription: false,
    use: 'Bone Health',
    description: 'For women\'s bone health.',
    manufacturer: 'GSK',
    stripQuantity: '15 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '85',
    name: 'Evening Primrose Oil',
    category: 'Women Care',
    price: 120,
    inStock: false,
    requiresPrescription: false,
    use: 'Hormonal Balance',
    description: 'For menstrual discomfort.',
    manufacturer: 'Himalaya',
    stripQuantity: '30 Capsules',
    regulatoryBadge: 'OTC'
  },
  {
    id: '86',
    name: 'Mefenamic Acid 500',
    category: 'Women Care',
    price: 55,
    inStock: true,
    requiresPrescription: false,
    use: 'Menstrual Pain',
    description: 'For period pain relief.',
    manufacturer: 'Dr Reddy\'s',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '87',
    name: 'Progesterone 200',
    category: 'Women Care',
    price: 85,
    inStock: true,
    requiresPrescription: true,
    use: 'Hormonal Support',
    description: 'Progesterone supplement.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '88',
    name: 'Estradiol Patches',
    category: 'Women Care',
    price: 150,
    inStock: false,
    requiresPrescription: true,
    use: 'HRT',
    description: 'Hormone replacement therapy.',
    manufacturer: 'Novartis',
    stripQuantity: '8 Patches',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '89',
    name: 'Vaginal Suppositories',
    category: 'Women Care',
    price: 70,
    inStock: true,
    requiresPrescription: true,
    use: 'Vaginal Health',
    description: 'For vaginal infections.',
    manufacturer: 'Cipla',
    stripQuantity: '7 Suppositories',
    regulatoryBadge: 'ScheduleH'
  },

  // Men Care (7)
  {
    id: '90',
    name: 'Tadalafil 10mg',
    category: 'Men Care',
    price: 120,
    inStock: true,
    requiresPrescription: true,
    use: 'ED Treatment',
    description: 'For erectile dysfunction.',
    manufacturer: 'Lupin',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '91',
    name: 'Sildenafil 50mg',
    category: 'Men Care',
    price: 100,
    inStock: false,
    requiresPrescription: true,
    use: 'ED Treatment',
    description: 'For erectile dysfunction.',
    manufacturer: 'Cipla',
    stripQuantity: '4 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '92',
    name: 'Finasteride 1mg',
    category: 'Men Care',
    price: 80,
    inStock: true,
    requiresPrescription: true,
    use: 'Hair Loss',
    description: 'For male pattern baldness.',
    manufacturer: 'Dr Reddy\'s',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '93',
    name: 'Testosterone Gel',
    category: 'Men Care',
    price: 200,
    inStock: true,
    requiresPrescription: true,
    use: 'Hormone Therapy',
    description: 'Testosterone replacement.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '14 Sachets',
    regulatoryBadge: 'ScheduleH'
  },
  {
    id: '94',
    name: 'Zinc + Magnesium',
    category: 'Men Care',
    price: 60,
    inStock: true,
    requiresPrescription: false,
    use: 'Male Health',
    description: 'Supplements for men\'s health.',
    manufacturer: 'Himalaya',
    stripQuantity: '30 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '95',
    name: 'Saw Palmetto',
    category: 'Men Care',
    price: 140,
    inStock: false,
    requiresPrescription: false,
    use: 'Prostate Health',
    description: 'For prostate health.',
    manufacturer: 'Nature\'s Bounty',
    stripQuantity: '30 Softgels',
    regulatoryBadge: 'OTC'
  },
  {
    id: '96',
    name: 'L-Arginine 3g',
    category: 'Men Care',
    price: 90,
    inStock: true,
    requiresPrescription: false,
    use: 'Sexual Health',
    description: 'Amino acid for blood flow.',
    manufacturer: 'GSK',
    stripQuantity: '10 Sachets',
    regulatoryBadge: 'OTC'
  },

  // Elder Care (8)
  {
    id: '97',
    name: 'Joint Pain Relief Oil',
    category: 'Elder Care',
    price: 85,
    inStock: true,
    requiresPrescription: false,
    use: 'Joint Pain',
    description: 'Ayurvedic oil for joint pain.',
    manufacturer: 'Himalaya',
    stripQuantity: '100ml Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '98',
    name: 'Memory Support Tablets',
    category: 'Elder Care',
    price: 120,
    inStock: true,
    requiresPrescription: false,
    use: 'Cognitive Health',
    description: 'Supplements for memory.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '30 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '99',
    name: 'Blood Pressure Monitor',
    category: 'Elder Care',
    price: 250,
    inStock: false,
    requiresPrescription: false,
    use: 'BP Monitoring',
    description: 'Digital BP monitor.',
    manufacturer: 'Omron',
    stripQuantity: '1 Unit',
    regulatoryBadge: 'OTC'
  },
  {
    id: '100',
    name: 'Glucosamine + Chondroitin',
    category: 'Elder Care',
    price: 150,
    inStock: true,
    requiresPrescription: false,
    use: 'Joint Health',
    description: 'For arthritis relief.',
    manufacturer: 'Nature Made',
    stripQuantity: '30 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '101',
    name: 'Melatonin 3mg',
    category: 'Elder Care',
    price: 45,
    inStock: true,
    requiresPrescription: false,
    use: 'Sleep Aid',
    description: 'For better sleep.',
    manufacturer: 'Cipla',
    stripQuantity: '10 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '102',
    name: 'Coenzyme Q10 100mg',
    category: 'Elder Care',
    price: 180,
    inStock: true,
    requiresPrescription: false,
    use: 'Heart Health',
    description: 'Antioxidant for heart.',
    manufacturer: 'Carlson',
    stripQuantity: '30 Softgels',
    regulatoryBadge: 'OTC'
  },
  {
    id: '103',
    name: 'Vitamin D3 2000 IU',
    category: 'Elder Care',
    price: 70,
    inStock: false,
    requiresPrescription: false,
    use: 'Bone Health',
    description: 'High dose vitamin D.',
    manufacturer: 'Dr Reddy\'s',
    stripQuantity: '30 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '104',
    name: 'Prostate Health Formula',
    category: 'Elder Care',
    price: 160,
    inStock: true,
    requiresPrescription: false,
    use: 'Prostate Health',
    description: 'For men\'s prostate health.',
    manufacturer: 'Himalaya',
    stripQuantity: '30 Tablets',
    regulatoryBadge: 'OTC'
  },

  // Child Care (8)
  {
    id: '105',
    name: 'Paracetamol Syrup 125mg',
    category: 'Child Care',
    price: 35,
    inStock: true,
    requiresPrescription: false,
    use: 'Fever & Pain',
    description: 'Children\'s paracetamol syrup.',
    manufacturer: 'Cipla',
    stripQuantity: '60ml Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '106',
    name: 'Ibuprofen Syrup 100mg',
    category: 'Child Care',
    price: 40,
    inStock: true,
    requiresPrescription: false,
    use: 'Pain & Fever',
    description: 'Children\'s ibuprofen syrup.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '50ml Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '107',
    name: 'Vitamin D3 Drops',
    category: 'Child Care',
    price: 55,
    inStock: true,
    requiresPrescription: false,
    use: 'Bone Health',
    description: 'Vitamin D drops for infants.',
    manufacturer: 'GSK',
    stripQuantity: '30ml Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '108',
    name: 'Zinc Syrup',
    category: 'Child Care',
    price: 45,
    inStock: false,
    requiresPrescription: false,
    use: 'Immunity',
    description: 'Zinc syrup for children.',
    manufacturer: 'Dr Reddy\'s',
    stripQuantity: '100ml Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '109',
    name: 'Cough Syrup for Kids',
    category: 'Child Care',
    price: 50,
    inStock: true,
    requiresPrescription: false,
    use: 'Cough Relief',
    description: 'Children\'s cough syrup.',
    manufacturer: 'Himalaya',
    stripQuantity: '100ml Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '110',
    name: 'Multivitamin Drops',
    category: 'Child Care',
    price: 65,
    inStock: true,
    requiresPrescription: false,
    use: 'Overall Health',
    description: 'Multivitamin drops for kids.',
    manufacturer: 'PediaSure',
    stripQuantity: '30ml Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '111',
    name: 'Calcium Syrup',
    category: 'Child Care',
    price: 60,
    inStock: true,
    requiresPrescription: false,
    use: 'Bone Health',
    description: 'Calcium syrup for children.',
    manufacturer: 'Cipla',
    stripQuantity: '200ml Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '112',
    name: 'Probiotic Sachets',
    category: 'Child Care',
    price: 80,
    inStock: false,
    requiresPrescription: false,
    use: 'Gut Health',
    description: 'Probiotics for children.',
    manufacturer: 'Danone',
    stripQuantity: '10 Sachets',
    regulatoryBadge: 'OTC'
  },

  // First Aid (8)
  {
    id: '113',
    name: 'Bandages 1 inch',
    category: 'First Aid',
    price: 25,
    inStock: true,
    requiresPrescription: false,
    use: 'Wound Care',
    description: 'Adhesive bandages.',
    manufacturer: 'Johnson & Johnson',
    stripQuantity: '20 Pieces',
    regulatoryBadge: 'OTC'
  },
  {
    id: '114',
    name: 'Antiseptic Cream',
    category: 'First Aid',
    price: 35,
    inStock: true,
    requiresPrescription: false,
    use: 'Wound Disinfection',
    description: 'Povidone iodine cream.',
    manufacturer: 'Cipla',
    stripQuantity: '20g Tube',
    regulatoryBadge: 'OTC'
  },
  {
    id: '115',
    name: 'Burn Cream',
    category: 'First Aid',
    price: 40,
    inStock: true,
    requiresPrescription: false,
    use: 'Burn Treatment',
    description: 'Silver sulfadiazine cream.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '25g Tube',
    regulatoryBadge: 'OTC'
  },
  {
    id: '116',
    name: 'Pain Relief Spray',
    category: 'First Aid',
    price: 55,
    inStock: false,
    requiresPrescription: false,
    use: 'Sprain Relief',
    description: 'Diclofenac spray for pain.',
    manufacturer: 'GSK',
    stripQuantity: '35g Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '117',
    name: 'Cotton Wool',
    category: 'First Aid',
    price: 20,
    inStock: true,
    requiresPrescription: false,
    use: 'Wound Cleaning',
    description: 'Sterile cotton wool.',
    manufacturer: 'Bombay Surgicals',
    stripQuantity: '100g Pack',
    regulatoryBadge: 'OTC'
  },
  {
    id: '118',
    name: 'Digital Thermometer',
    category: 'First Aid',
    price: 150,
    inStock: true,
    requiresPrescription: false,
    use: 'Temperature Check',
    description: 'Digital fever thermometer.',
    manufacturer: 'Omron',
    stripQuantity: '1 Unit',
    regulatoryBadge: 'OTC'
  },
  {
    id: '119',
    name: 'Glucometer Strips',
    category: 'First Aid',
    price: 200,
    inStock: true,
    requiresPrescription: false,
    use: 'Blood Sugar Test',
    description: 'Glucometer test strips.',
    manufacturer: 'Accu-Chek',
    stripQuantity: '50 Strips',
    regulatoryBadge: 'OTC'
  },
  {
    id: '120',
    name: 'First Aid Kit',
    category: 'First Aid',
    price: 300,
    inStock: false,
    requiresPrescription: false,
    use: 'Emergency Kit',
    description: 'Complete first aid kit.',
    manufacturer: 'Himalaya',
    stripQuantity: '1 Kit',
    regulatoryBadge: 'OTC'
  },

  // Daily Wellness (8)
  {
    id: '121',
    name: 'Green Tea Extract',
    category: 'Daily Wellness',
    price: 85,
    inStock: true,
    requiresPrescription: false,
    use: 'Antioxidant',
    description: 'Green tea capsules for health.',
    manufacturer: 'Himalaya',
    stripQuantity: '30 Capsules',
    regulatoryBadge: 'OTC'
  },
  {
    id: '122',
    name: 'Turmeric Curcumin',
    category: 'Daily Wellness',
    price: 95,
    inStock: true,
    requiresPrescription: false,
    use: 'Anti-Inflammatory',
    description: 'Turmeric supplement.',
    manufacturer: 'Nature\'s Bounty',
    stripQuantity: '30 Capsules',
    regulatoryBadge: 'OTC'
  },
  {
    id: '123',
    name: 'Ashwagandha 300mg',
    category: 'Daily Wellness',
    price: 110,
    inStock: true,
    requiresPrescription: false,
    use: 'Stress Relief',
    description: 'Ayurvedic stress reliever.',
    manufacturer: 'Himalaya',
    stripQuantity: '30 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '124',
    name: 'Spirulina Tablets',
    category: 'Daily Wellness',
    price: 75,
    inStock: false,
    requiresPrescription: false,
    use: 'Nutrition',
    description: 'Spirulina superfood.',
    manufacturer: 'Sun Pharma',
    stripQuantity: '30 Tablets',
    regulatoryBadge: 'OTC'
  },
  {
    id: '125',
    name: 'Wheatgrass Powder',
    category: 'Daily Wellness',
    price: 120,
    inStock: true,
    requiresPrescription: false,
    use: 'Detox',
    description: 'Wheatgrass for detoxification.',
    manufacturer: 'Himalaya',
    stripQuantity: '100g Pack',
    regulatoryBadge: 'OTC'
  },
  {
    id: '126',
    name: 'Aloe Vera Juice',
    category: 'Daily Wellness',
    price: 140,
    inStock: true,
    requiresPrescription: false,
    use: 'Digestive Health',
    description: 'Aloe vera for digestion.',
    manufacturer: 'Patanjali',
    stripQuantity: '500ml Bottle',
    regulatoryBadge: 'OTC'
  },
  {
    id: '127',
    name: 'Honey 500g',
    category: 'Daily Wellness',
    price: 180,
    inStock: true,
    requiresPrescription: false,
    use: 'Natural Sweetener',
    description: 'Pure honey for health.',
    manufacturer: 'Dabur',
    stripQuantity: '500g Jar',
    regulatoryBadge: 'OTC'
  },
  {
    id: '128',
    name: 'Triphala Powder',
    category: 'Daily Wellness',
    price: 90,
    inStock: false,
    requiresPrescription: false,
    use: 'Digestive Health',
    description: 'Ayurvedic digestive formula.',
    manufacturer: 'Himalaya',
    stripQuantity: '100g Pack',
    regulatoryBadge: 'OTC'
  }
];

/* ---------------- CATEGORIES ---------------- */
const CATEGORIES = [
  'All',
  'Fever & Pain',
  'Antibiotics',
  'Diabetes Care',
  'BP & Heart',
  'Vitamins & Supplements',
  'Cold & Cough',
  'Stomach Care',
  'Skin Care',
  'Eye & Ear Care',
  'Women Care',
  'Men Care',
  'Elder Care',
  'Child Care',
  'First Aid',
  'Daily Wellness'
];

/* ---------------- COMPONENT ---------------- */
interface PharmacyProps {
  onAddToCart?: (medicine: Medicine) => void;
  cartItemCount?: number;
  onMedicineSelect?: (medicineId: string) => void;
}

export const Pharmacy: React.FC<PharmacyProps> = ({ onAddToCart, cartItemCount, onMedicineSelect }) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showStockAlert, setShowStockAlert] = useState(false);
  const [showOutOfStockAlert, setShowOutOfStockAlert] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [requiresPrescription, setRequiresPrescription] = useState<'all' | 'yes' | 'no'>('all');
  const [showPrescriptionPicker, setShowPrescriptionPicker] = useState(false);

  const filteredMedicines = MEDICINES.filter(med => {
    const matchCategory =
      selectedCategory === 'All' || med.category === selectedCategory;
    const matchSearch = med.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchPrice = med.price >= priceRange[0] && med.price <= priceRange[1];
    const matchStock = !inStockOnly || med.inStock;
    const matchPrescription =
      requiresPrescription === 'all' ||
      (requiresPrescription === 'yes' && med.requiresPrescription) ||
      (requiresPrescription === 'no' && !med.requiresPrescription);
    return matchCategory && matchSearch && matchPrice && matchStock && matchPrescription;
  });

  return (
    <div className="space-y-8 pb-12">

      {/* ================= HERO ================= */}
      <div className="relative rounded-3xl glass-panel p-8 md:p-12 border border-white/10 shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-4">
              <Bot className="w-4 h-4" />
              AI-Powered E-Pharmacy (India)
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Smart & Safe <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                Online Pharmacy
              </span>
            </h1>

            <p className="text-slate-300 mb-8 max-w-xl">
              Genuine medicines dispensed as per Indian regulations.
            </p>

            <div className="flex gap-4">
              <Button
                onClick={() => setActiveTab('catalog')}
                className={activeTab === 'catalog'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600'
                  : 'bg-white/5 hover:bg-white/10'}
              >
                Browse Medicines
              </Button>

              <Button
                onClick={() => setActiveTab('orders')}
                className={activeTab === 'orders'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600'
                  : 'bg-white/5 hover:bg-white/10'}
              >
                Track Orders
              </Button>
            </div>
          </div>

          {/* RIGHT IMAGE — ✅ LOCAL IMAGE */}
          <div className="relative">
            <img
              src="/pharmacy-hero.jpg"
              alt="Indian pharmacy healthcare"
              className="w-full h-[220px] md:h-[300px] object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
          </div>
        </div>

        {/* TRUST */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            DCGI Approved
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Secure Rx Upload
          </div>
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-blue-400" />
            Licensed Medicines
          </div>
          <div className="flex items-center gap-2">
            🇮🇳 Data Stored in India
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      {activeTab === 'orders' ? (
        <Orders />
      ) : (
        <div className="grid lg:grid-cols-4 gap-8">

          {/* SIDEBAR */}
          <div className="hidden lg:block glass-panel p-6 rounded-2xl">
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`block w-full text-left px-4 py-2 rounded-lg mb-1 ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* MAIN */}
          <div className="lg:col-span-3 space-y-6">

            {/* SEARCH */}
            <div className="relative glass-panel p-4 rounded-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search medicines..."
                className="w-full bg-transparent pl-12 pr-4 py-3 text-white outline-none"
              />
            </div>

            {/* FILTERS */}
            <div className="glass-panel p-4 rounded-xl space-y-4">
              <h3 className="text-white font-semibold mb-3">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Price Range</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                      placeholder="Min"
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                      placeholder="Max"
                      className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>

                {/* In Stock Only */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Availability</label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={e => setInStockOnly(e.target.checked)}
                      className="rounded border-slate-600 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-slate-300 text-sm">In Stock Only</span>
                  </label>
                </div>

                {/* Prescription Required */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Prescription</label>
                  <div
                    onClick={() => setShowPrescriptionPicker(true)}
                    className="w-full bg-slate-800/50 backdrop-blur border border-slate-600 rounded-xl px-4 py-3 text-white text-sm cursor-pointer flex justify-between items-center hover:bg-slate-700/50 transition-colors"
                  >
                    <span>
                      {requiresPrescription === 'all' && 'All Medicines'}
                      {requiresPrescription === 'yes' && 'Prescription Required'}
                      {requiresPrescription === 'no' && 'No Prescription'}
                    </span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* iOS Style Prescription Picker Modal */}
                {showPrescriptionPicker && (
                  <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-fade-in" 
                    onClick={() => setShowPrescriptionPicker(false)}
                  >
                    <div
                      className="w-full max-w-sm bg-white/10 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden animate-scale-up"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="p-4 border-b border-slate-700/50 text-center">
                        <h3 className="text-lg font-semibold text-white">Prescription Filter</h3>
                        <p className="text-xs text-slate-400">Select medicine type</p>
                      </div>
                      <div className="max-h-[60vh] overflow-y-auto">
                        {[
                          { value: 'all', label: 'All Medicines' },
                          { value: 'yes', label: 'Prescription Required' },
                          { value: 'no', label: 'No Prescription' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setRequiresPrescription(option.value as 'all' | 'yes' | 'no');
                              setShowPrescriptionPicker(false);
                            }}
                            className={`w-full p-4 text-center text-lg border-b border-slate-700/50 transition-colors active:bg-slate-700 ${
                              requiresPrescription === option.value
                                ? 'text-cyan-400 font-bold bg-cyan-500/10'
                                : 'text-slate-200 hover:bg-slate-800/50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <div className="p-2 bg-slate-900/50">
                        <button
                          onClick={() => setShowPrescriptionPicker(false)}
                          className="w-full p-3 rounded-2xl font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* GRID */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map(med => (
                <div
                  key={med.id}
                  className="glass-panel p-5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => {
                    // Add to recently viewed
                    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                    const existingIndex = viewed.findIndex((v: any) => v.medicineId === med.id);
                    if (existingIndex >= 0) {
                      viewed.splice(existingIndex, 1); // Remove if exists to update timestamp
                    }
                    viewed.unshift({
                      medicineId: med.id,
                      name: med.name,
                      strength: med.stripQuantity,
                      price: med.price,
                      timestamp: Date.now()
                    });
                    // Keep only last 10
                    if (viewed.length > 10) viewed.splice(10);
                    localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
                  }}
                >
                  <h3 className="text-white font-bold">{med.name}</h3>
                  <p className="text-xs text-slate-400">{med.manufacturer}</p>
                  <p className="text-sm text-slate-300 mt-2">{med.use}</p>

                  <div className="mt-4 flex justify-between items-end">
                    <div>
                      <span className="text-xl font-bold text-white">
                        ₹{med.price}
                      </span>
                      <div className="text-xs text-slate-500">
                        {med.stripQuantity}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        setShowOutOfStockAlert(true);
                      }}
                      className="bg-slate-600 hover:bg-slate-500"
                    >
                      Out of Stock
                    </Button>
                  </div>

                  {med.requiresPrescription && (
                    <div className="mt-2 text-xs text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Prescription Required
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ALERT */}
      <AlertModal
        isOpen={showStockAlert}
        message="This item is currently unavailable."
        onClose={() => setShowStockAlert(false)}
      />

      {/* OUT OF STOCK ALERT */}
      <AlertModal
        isOpen={showOutOfStockAlert}
        message="Out of stock, please come later."
        onClose={() => setShowOutOfStockAlert(false)}
      />

      {/* CHAT (OPTIONAL) */}
      {showAssistant && (
        <div className="fixed bottom-6 right-6 w-80 h-96 glass-panel rounded-xl">
          <div className="p-4 flex justify-between items-center">
            <span className="text-white">AI Assistant</span>
            <button onClick={() => setShowAssistant(false)} className="hover:bg-slate-700 rounded p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <input
              placeholder="Ask about medicines..."
              className="w-full p-2 bg-slate-800 rounded"
            />
            <Button className="mt-2 w-full">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
