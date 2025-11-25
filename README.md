# 🌍 WasteEasy – Household Waste-to-Energy Web App

WasteEasy is a clean, intuitive, and educational web application built to demonstrate how everyday household waste can be converted into renewable energy in simple, safe, and effective ways.  

This project was developed under **Problem Statement AVS311 (Software / Web Development)** by **Team Gadget Geeks**.

---

## 🧩 Problem Statement

Household waste has strong potential to generate renewable energy. However, there are **not enough simple and effective solutions** that help people understand:

- how their waste can be processed  
- what type of energy it can generate  
- how to manage waste safely at home  
- how waste segregation impacts sustainability  

Most existing solutions are complex, industrial, or not accessible to everyday users.

---

## 🎯 Purpose of the Project

- To **educate users** on how household waste can be transformed into renewable energy.  
- To **simplify complex waste-to-energy processes** using an interactive web platform.  
- To promote **home-level waste segregation** through clear visual guidance.  
- To strengthen awareness about **sustainable waste management** practices.  
- To show the **environmental impact** of shifting from waste → energy.

---

## 💡 Our Solution: WasteEasy Web App

We built a **Next.js based web application** that:

- Categorizes waste into simple groups  
- Shows how each category can be processed  
- Explains biogas, composting, recycling, and energy conversion  
- Demonstrates how each waste type contributes to renewable energy  
- Uses a clean, modern interface with simple explanations  
- Helps users understand sustainability in an easy, practical way  

This app is made for **everyone**, regardless of technical background.

## 📁 Project Structure

```text
waste-to-energy-app/

│
├── app/                           # Next.js App Router pages
│   ├── dashboard/                 # User dashboard
│   │   └── page.tsx               # Shows waste stats, charts, energy, CO₂ saved
│   ├── log/                       # Manual waste logging form
│   │   └── page.tsx
│   ├── ai-classifier/             # Image upload + AI classification UI
│   │   └── page.tsx
│   ├── event/                     # Event Mode for marriages/functions
│   │   └── page.tsx
│   ├── map/                       # Mapbox-based nearby center finder
│   │   └── page.tsx
│   ├── api/                       # Serverless backend API routes
│   │   ├── classify/route.ts      # Calls Gemini/OpenAI Vision for waste AI
│   │   ├── waste/route.ts         # Save waste logs + energy calculations
│   │   ├── events/route.ts        # Event waste processing + summary
│   │   ├── centers/route.ts       # Returns NGO/recycling center list
│   │   └── ecobot/route.ts        # Chatbot → AI Chat API handler
│   └── layout.tsx                 # Root layout
│
├── components/                    # Reusable UI components
│   ├── WasteFlowDiagram.tsx       # 2D Waste-to-energy flow visualization
│   ├── EcoBot.tsx                 # Chatbot floating widget
│   ├── Navbar.tsx                 # App navigation
│   └── Charts/                    # Charts + widgets
│       ├── WastePieChart.tsx
│       ├── EnergyCard.tsx
│       └── Co2SavedCard.tsx
│
├── lib/
│   ├── supabase.ts                # Supabase client setup
│   ├── energy.ts                  # Energy + CO₂ calculation helper
│   └── centers.ts                 # Static list of recycling centers
│
├── public/                        # Static assets (icons, images)
│   ├── icons/                     
│   └── logo.png
│
├── styles/
│   └── globals.css                # Tailwind + global styles
│
├── .env.local                     # API keys (Supabase, Gemini, Mapbox)
│
├── package.json                   # Dependencies + scripts
├── tsconfig.json                  # TypeScript config
├── .gitignore                     # Ignore node_modules, .next, env files
└── README.md                      # Project documentation
```

## ✨ Key Features

### ⭐ **1. Waste Categories Explained Clearly**
Organic • Recyclable • Hazardous • Electronic • Mixed Waste

### ⭐ **2. Processing Methods**
- Composting  
- Biogas generation  
- Recycling  
- Segregation flow  
- Waste-to-energy conversion  

### ⭐ **3. Energy Conversion Insights**
Shows how household waste can result in:  
- Biogas  
- Heat  
- Electricity  
- Reduced carbon emissions  

### ⭐ **4. Clean & Responsive UI**
Built with modern UI components for smooth navigation.

### ⭐ **5. Educational & Awareness Focused**
Simple content designed for households, students, and communities.

---

## 🎯 Target Audience

### 👪 **Households & Families**
People who want easy guidance to manage waste sustainably.

### 🏘️ **Residential Communities / RWAs**
To promote cleaner living and collective waste management.

### 🎓 **Students & Educational Institutes**
Useful for science, environment, and sustainability projects.

### 🌱 **Environmentally Conscious Citizens**
Who want to reduce waste and understand renewable energy.

### 🛠 **Waste Management Professionals**
For demonstrating clean waste handling and processing.

### 🌍 **NGOs & Environmental Organizations**
For awareness programs and community workshops.

---

## 🏗️ System Architecture

The architecture is designed to be **modular, scalable, and easily extendable**.

### 🔹 **1. Presentation Layer (Next.js UI)**
- Pages built under `app/`
- Tailwind + ShadCN for styling
- Responsive layout for all devices

### 🔹 **2. Logic Layer**
- Waste category logic  
- Processing method mapping  
- Energy output explanation  
- Located inside `lib/` as helper functions

### 🔹 **3. Asset Layer**
- Icons, images, and illustrations stored in `/public`

### 🔹 **4. Configuration Layer**
- `next.config.mjs`
- `tailwind.config.js`
- `tsconfig.json`

### 📁 Folder Structure


---

## 🔄 User Flow

1. User opens the website  
2. Views introduction to waste & renewable energy  
3. Navigates through waste categories  
4. Learns how each type is processed  
5. Understands what energy can be produced  
6. Gains knowledge on sustainability and better waste management  

---

## 🛠 Tech Stack

**Frontend:**  
- Next.js  
- React  
- TypeScript  

**Styling:**  
- Tailwind CSS  
- ShadCN UI  

**Development:**  
- Node.js  
- pnpm / npm  
- VS Code  

**Deployment:**  
- Vercel (recommended)

---

## 🖼️ Screenshots

*(Replace these placeholders with your screenshots later. I will adjust if you upload images.)*


---

## ⚙️ Running the Project Locally

```bash
git clone https://github.com/swatiiisinghh/gadgetgeeks-wasteeasy.git
cd gadgetgeeks-wasteeasy
npm install
npm run dev
