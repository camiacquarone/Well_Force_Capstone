# Project Plan

Pod Members: Joshua Donatien, Camila Acquarone, and Janine Jimenez

## Problem Statement and Description

Despite Salesforce’s strong investment in employee wellbeing, many employees are unaware of available benefits or unsure how to use them. This project proposes a personalized wellbeing platform called Wellforce, helping Salesforce employees easily discover and use their benefits through tailored suggestions and an AI Companion that simplifies access to meals, physical wellness, and other resources.


## User Roles and Personas

1. Salesforce Employee in the San Francisco Office
      - A Salesforce Software Engineer on the Slack Team looking to view a daily list of healthy snack options available in the office, so that they can make better nutritional choices during their workday.
      - An FTL SWE intern they want to browse a guide of all available office snacks and drinks, so they can take advantage of what's available during their short time here
3. Admin - Employee who can edit the snacks available
      - A Salesforce employee in charge of snacks want to add a new seasonal snack available.
      - A Salesforce employee wants to remove a snack that is no longer available.

## User Stories

1. As a Salesforce employee, I want to view a daily list of healthy snack options available in the office, so that I can make better nutritional choices during my workday.
2. As a Salesforce employee, I want to discover local meal spots with healthy lunch options near the office, so I can maintain a balanced diet even when eating out.
3. As a new Salesforce intern, I want to browse a guide of all available office snacks and drinks, so I can take advantage of what's available during my short time here.
4. As a new Salesforce employee, I want to be able to filter snacks by dietary preferences (e.g., vegan, gluten-free), so I can easily find what fits my needs.
5. As a Salesforce employee, I want to see a curated list of healthy meal options near the office, so I don’t waste time searching for food.
6. As a Salesforce employee, I want to set dietary preferences once, so the app only shows me meals that match my eating habits.
7. As a Salesforce employee, I want to get daily or weekly healthy meal suggestions, so I spend less time figuring out what to eat.
8. As a Salesforce employee, I want to track how often I make healthy choices, so I can stay motivated and consistent.

## Pages/Screens

Pages
- Landing Page
<img width="501" height="394" alt="image" src="https://github.com/user-attachments/assets/64c60167-aaf2-4c0e-9564-071f732a1069" />

- Sign Up/Log In Page
<img width="504" height="404" alt="image" src="https://github.com/user-attachments/assets/67d79902-0948-4fce-b29d-4f084de3c30f" />

- Profile Setup Page
<img width="505" height="410" alt="image" src="https://github.com/user-attachments/assets/2387f829-1c2a-4e7f-b2a2-159fe6db9b14" />

- Home Page
- Food Page
<img width="476" height="319" alt="image" src="https://github.com/user-attachments/assets/e6615225-c9c2-44d9-b0d0-74e30bd3a097" />


# Wellfore App – Data Model & API Endpoints  

## Data Model

```prisma
model User { 
  id            Int           @id @default(autoincrement())  // unique user ID 
  username      String                                      // login username 
  password      String                                      // login password 
  image_url     String                                      // profile picture URL 
  name          String                                      // full name 
  dietary_pref  Dietary_Preferences[]?                      // user's dietary preferences 
  goals         Goals[]                                     // user's wellness goals 
  role          String                                      // user role (e.g., admin, employee) 
} 

model Goals { 
  id            Int           @id @default(autoincrement())  // unique goal ID 
  title         String                                      // goal title 
  description   String                                      // goal details 
  categoty      String                                      // category of the goal 
} 

model Dietary_Preferences { 
  id              Int         @id @default(autoincrement())  // unique preference ID 
  isGlutenFree    Boolean?                                   // gluten-free option 
  isLactoseInt    Boolean?                                   // lactose intolerance option 
  isVegan         Boolean?                                   // vegan option 
  isVegetarian    Boolean?                                   // vegetarian option 
  isKeto          Boolean?                                   // keto option 
  Allergies       String[]                                   // allergy list 
} 

model Snacks { 
  id                    Int                       @id @default(autoincrement())  // unique snack ID 
  name                  String                                              // snack name 
  image_url             String?                                             // snack image URL 
  description           String                                              // snack details 
  wellness_category     String[]                                           // related wellness categories 
  dietary_preferences   Dietary_Preferences[]                               // snack dietary tags 
  nutritional_info      nutritional_information[]                           // snack nutrition info 
} 

model Meals { 
  id                        Int                        @id @default(autoincrement())  // unique meal ID 
  name                     String                                      // meal name 
  image_url                String?                                     // meal image URL 
  price                    Float                                       // meal price 
  nutritional_information  Nutritional_Information[]                   // meal nutrition info 
  dietary_preferences      Dietary_Preferences[]                       // meal dietary tags 
  restaurant_name          String                                      // restaurant name 
} 

model Nutritional_Information { 
  id              Int   @id @default(autoincrement())  // unique nutrition info ID 
  serving_size    Int?                                // portion size 
  calories        Int?                                // calorie count 
  total_fat       Int?                                // fat content 
  cholesterol     Int?                                // cholesterol amount 
  sodium          Int?                                // sodium content 
  total_carbs     Int?                                // carbohydrate amount 
  protein         Int?                                // protein content 
  sugars          Int?                                // sugar content 
} 

model Recommendation { 
  id             Int       @id @default(autoincrement())  // unique recommendation ID 
  type           String?                                 // recommendation type 
  user           User      @relation(fields: [UserId], references: [id])  // related user 
  UserId         Int                                      // foreign key to User 
  meal           Meals     @relation(fields: [mealId], references: [id])  // related meal 
  mealId         Int                                      // foreign key to Meal 
  status         String?                                  // recommendation status 
} 

model Benefits { 
  id              Int        @id @default(autoincrement())  // unique benefit ID 
  title           String                                      // benefit title 
  description     String                                      // benefit details 
  category        String                                      // benefit category 
  availabe_for    String                                      // user role eligibility 
}

``` 

## Endpoints
```
User Story 1:
 As a Salesforce employee, I want to view a daily list of healthy snack options available in the office.
 → GET /api/snacks
User Story 2:
 As a Salesforce employee, I want to discover local meal spots with healthy lunch options near the office.
 → GET /meals
User Story 3:
 As a new Salesforce intern, I want to browse a guide of all available office snacks and drinks.
 → GET /snacks
User Story 4:
 As a new Salesforce employee, I want to be able to filter snacks by dietary preferences (e.g., vegan, gluten-free).
 → GET /snacks?tags=vegan (or other filters)
User Story 5:
 As a Salesforce employee, I want to see a curated list of healthy meal options near the office.
 → GET /meals
User Story 6:
 As a Salesforce employee, I want to set dietary preferences once, so the app only shows me meals that match my eating habits.
 → POST /goals (store preferences)
 → GET /meals?tags=vegetarian
User Story 7:
 As a Salesforce employee, I want to get daily or weekly healthy meal suggestions.
 → POST /chat (send preferences and fetch suggestions from GPT)
 → POST /recommendations
User Story 8:
 As a Salesforce employee, I want to track how often I make healthy choices.
 → GET /meals
 
CRUD        HTTP Verb     Description                                          User Stories         
Read        GET           Fetch daily healthy snack options                    1
Read        GET           Discover local meal spots with healthy lunch         2, 5
Read        GET           Browse guide of all available office snacks          3
Read        GET           Filter snacks by dietary preferences                 4
Create      POST          Set dietary preferences                              6
Read        GET           Get meals matching dietary preferences               6
Create      POST          Get daily/weekly healthy meal suggestions            7
Create      POST          Store recommendations                                7
Read        GET           Track healthy choices / view meal logs               8

***Don't forget to set up your Issues, Milestones, and Project Board!***
