# UnitCalculatorForCooking

This is a German webapp where you can input and save ingredients for recipes and also recalculate proportions.

To start this app, you can create a new .bat-file with following code:

```
@echo off
cd /d "C:\{your path}\UnitCalculatorForCooking\recipe-calculator"
start http://localhost:5173
npm run dev
```

Save this, then you can run the app.


**Features:**


Convert us units to european units.

Available volume units: us cup, us fl oz, us pt, us qt, us gal, tbsp, tsp

Available mass units: oz, lbs/pound, stick butter

You can submit every single ingredient. 

After submitting, you can change the ratio of your portions, and the app will recalculate all ingredients according to the given ratio.


**Tech stack:** React + TypeScript + Vite
