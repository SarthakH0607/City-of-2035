# 🧪 TESTING GUIDE - City of 2035 Enhancements

## 🚀 **QUICK START**

Server is running at: **http://localhost:5174/**

### Login Credentials:
1. Sign up with test account, or
2. Use credentials from previous signup

---

## ✅ **TEST CHECKLIST**

### 1. **MAP & MARKERS TEST** 🗺️

**What to verify:**
- [ ] Map loads with dark theme tiles
- [ ] Map background is dark (CartoDB Dark)
- [ ] 5 EV station markers visible on map
- [ ] Markers have glowing effect with pulse animation
- [ ] Each marker shows color based on crowd level

**Steps:**
1. Navigate to Dashboard
2. Look at "Live Mobility Grid" section
3. Check marker colors:
   - 🟢 Green = Low crowd (HyperCharge A, EcoHub D)
   - 🟡 Yellow = Medium crowd (Solar Dock B)
   - 🔴 Red = High crowd (MetroCharge C, Nucleus E)

---

### 2. **MOOD SWITCHING TEST** 😌😰🧠

**What to verify:**
- [ ] Three mood buttons visible in Topbar
- [ ] Mood buttons glow when selected
- [ ] Switching moods updates all components smoothly

**Steps:**
1. Look at top-right Topbar section
2. See three buttons: "Calm", "Focused", "Stressed"
3. Click each mood button and verify:

---

### 3. **STRESSED MODE TEST** 😰

**When selected:**
- [ ] Only 2 green EV stations visible on map (Low crowd)
- [ ] EV Stations card shows only 1 station (HyperCharge Hub A)
- [ ] Status message: "✓ Showing only low-crowd stations"
- [ ] Suggestion Panel shows:
  - Icon: 🧘
  - Title: "😰 Stress Relief Mode"
  - 4 suggestions about low crowd options
- [ ] UI saturation increases slightly
- [ ] Map status bar shows "Low Crowd Only"

**Expected behavior:**
- HyperCharge A ✓ (visible)
- EcoHub D ✓ (visible)
- Solar Dock B ✗ (hidden)
- MetroCharge C ✗ (hidden)
- Nucleus E ✗ (hidden)

---

### 4. **CALM MODE TEST** 😌

**When selected:**
- [ ] All 5 EV stations visible on map
- [ ] EV Stations card shows all 3 stations
- [ ] No special filtering message
- [ ] Suggestion Panel shows:
  - Icon: 🌊
  - Title: "😌 Calm Mode"
  - 4 suggestions about eco-friendly routes
- [ ] Smooth animations enabled
- [ ] Map status bar shows "All Stations"
- [ ] UI has normal saturation
- [ ] Cyan/teal colored accents

---

### 5. **FOCUSED MODE TEST** 🧠

**When selected:**
- [ ] Only 1 EV station visible on map (nearest one)
- [ ] EV Stations card shows only 1 station
- [ ] Status message: "⚡ Nearest station only"
- [ ] Suggestion Panel shows:
  - Icon: ⚡
  - Title: "🧠 Focused Mode"
  - 4 suggestions about minimizing distractions
- [ ] Purple accent color for buttons and glows
- [ ] Map status bar shows "Nearest Only"
- [ ] Minimal UI - less visual clutter

---

### 6. **EV STATIONS CARD TEST** 📍

**What to verify:**
- [ ] Card title: "EV Charging Stations"
- [ ] Availability bars animate on load
- [ ] Crowd level emoji shown:
  - 🟢 for low
  - 🟡 for medium
  - 🔴 for high
- [ ] Availability percentages correct:
  - HyperCharge Hub A: 82%
  - Solar Grid Dock B: 54%
  - MetroCharge Node C: 68%
- [ ] Mood-based filtering works (see tests 3-5)
- [ ] Status messages update with mood

---

### 7. **SUGGESTION PANEL TEST** 💡

**What to verify:**
- [ ] Panel visible in right sidebar
- [ ] Updates when mood changes
- [ ] Mood emoji and title visible
- [ ] 4 suggestions displayed per mood
- [ ] Smooth entry animation
- [ ] Color-coded left border (green/cyan/purple)
- [ ] Current route section shows:
  - Route title
  - ETA
  - AQI value
  - Crowd level

---

### 8. **ANIMATION TEST** ✨

**What to verify:**
- [ ] Markers have subtle pulse animation
- [ ] Suggestion Panel has smooth fade-in
- [ ] Station list animates when filtering
- [ ] Modal/card transitions are smooth
- [ ] No jarring or abrupt changes

---

### 9. **MAP INTERACTION TEST** 🖱️

**What to verify:**
- [ ] Click on markers shows popup with info:
  - Station name
  - Availability percentage
  - Crowd level
- [ ] Popups show immediately
- [ ] Can close popups by clicking away
- [ ] Routes display correctly on map
- [ ] Different routes have different colors

---

### 10. **CROSS-MOOD CONSISTENCY TEST** 🔄

**Steps:**
1. Start in Calm mode
2. Optimize routes (use "Optimize Routes" button)
3. Switch to Stressed mode → Verify filtered stations
4. Switch to Focused mode → Verify single station
5. Switch back to Calm mode → Verify all stations return
6. Each transition should be smooth

---

## 📊 **DETAILED FEATURE VERIFICATION**

### Dark Theme Map
```
Expected: CartoDB Dark All tiles
Actual: 
- Background color: Dark gray/black
- Labels: Light text
- Features: Subtle map details
- Blends with UI: Yes
```

### Marker Icons
```
Expected: Custom glowing circles with emoji
Actual:
- Icon: ⚡ emoji in center
- Color: Based on crowd level
- Glow: Visible box-shadow
- Animation: Pulsing effect
- Border: White/transparent outline
```

### Mood State Changes
```
Calm (Default)
├─ All stations shown: 5
├─ Color accent: Cyan (#4dc4ff)
├─ Animation speed: Normal (1x)
└─ Suggestion: Eco-friendly routes

Focused
├─ Stations shown: 1 (nearest)
├─ Color accent: Purple (#8b5cf6)
├─ Animation speed: Faster (0.8x)
└─ Suggestion: Minimal distractions

Stressed
├─ Stations shown: 2 (low crowd only)
├─ Color accent: Green (#22c55e)
├─ Animation speed: Faster (1.2x)
└─ Suggestion: Least crowded options
```

---

## 🐛 **TROUBLESHOOTING**

### Markers not showing?
- Check network tab for marker image loads
- Ensure Leaflet images are imported correctly
- Clear browser cache and reload

### Dark theme not applied?
- Check CartoDB URL is correct
- Verify TileLayer attribution text
- Reload page if theme appears light

### Suggestion Panel missing?
- Check that SuggestionPanel.jsx exists in components folder
- Verify import in Dashboard.jsx
- No console errors? Check developer console

### Mood changes not affecting map?
- Verify mood prop passed to MapView
- Check console for errors
- Ensure useState hook working properly

### Station filtering not working?
- Check mood state updates
- Verify filtering logic in MapView.jsx
- Test with different crowd levels

---

## ✅ **FINAL VALIDATION CHECKLIST**

- [ ] Dark theme map loads
- [ ] 5 EV stations visible in calm mode
- [ ] Mood buttons switch properly
- [ ] Stressed mode shows 2 stations
- [ ] Focused mode shows 1 station
- [ ] Suggestion Panel appears and updates
- [ ] All animations smooth
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] All popups work correctly

---

## 🎯 **SUCCESS CRITERIA**

✅ **Project is ready when:**
1. Map displays with dark theme
2. All EV stations have markers with crowd indicators
3. Mood affects station visibility
4. Suggestions panel shows mood-specific content
5. Smooth animations throughout
6. No console errors
7. Server runs without issues: `npm run dev`

---

**Status**: Ready for testing! 🚀
