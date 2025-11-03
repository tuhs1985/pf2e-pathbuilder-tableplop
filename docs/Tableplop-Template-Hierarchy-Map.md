# Tableplop Template Hierarchy Map (IDs, Parents, Columns, Titles)

Purpose
- An authoritative, reproducible map of the PF2e Tableplop template.
- Lists every property with id, parentId, type, and where relevant name/value/formula, grouped by Tab → Column → Title-section → Children.
- Ordering within a parent is defined by rank.

Conventions
- container: layout element (tab-section, horizontal-section, section).
- title: title-section (visible header in a section).
- widget: field/message/etc. (actual content).
- If a title-section appears under another title-section, it is preserved as-is (even if unusual).

Source: PC Template.json (provided)

---

## Character tab — id: 77228047 (type: tab-section, value: "Character", rank: -5)
- container: 77227847 (horizontal-section, parentId: 77228047, rank: -4)
  - Left column: 77227941 (section, size: 62.76995305164285, rank: 0)
    - title: 77227917 "Character Details" (rank: -1)
      - widget: 77227952 text Name "[NAME]" (rank: -8)
      - widget: 77227874 text Ancestry "[ANCESTRY]" (rank: -7)
      - widget: 77227876 text Heritage "[HERITAGE]" (rank: -6)
      - widget: 77227880 text Class "[CLASS]" (rank: -5)
      - widget: 77227859 text Background "[BACKGROUND]" (rank: -4)
      - widget: 77227939 number Level 1 (rank: 0)
      - widget: 77227940 number Experience 0 (rank: -1)
    - title: 77227822 "Ability Scores" (rank: 0)
      - widget: 77227995 ability Dexterity (rank: 0), formula: floor ((dexterity-score - 10) / 2)
        - widget: 77227911 number dexterity-score 10 (rank: 0)
      - widget: 77228070 ability Constitution (rank: 1), formula: floor ((constitution-score - 10) / 2)
        - widget: 77227932 number constitution-score 10 (rank: 0)
      - widget: 77228071 ability Intelligence (rank: 2), formula: floor ((intelligence-score - 10) / 2)
        - widget: 77227933 number intelligence-score 10 (rank: 0)
      - widget: 77227994 ability Wisdom (rank: 3), formula: floor ((wisdom-score - 10) / 2)
        - widget: 77227912 number wisdom-score 10 (rank: 0)
      - widget: 77228068 ability Charisma (rank: 4), formula: floor ((charisma-score - 10) / 2)
        - widget: 77227934 number charisma-score 10 (rank: 0)
      - widget: 77228072 ability Strength (rank: -1), formula: floor ((strength-score - 10) / 2)
        - widget: 77227839 number strength-score 10 (rank: 0)
      - title (nested under Ability Scores): 77228069 "Combat Info" (rank: 7)
        - container: 77227882 (horizontal-section, rank: -5)
          - Left sub-column: 77227883 (section, size: 50, rank: 0)
            - widget: 77227844 number Class DC 10 (rank: -2)
            - widget: 77227877 health hit-points 10 (rank: -4)
              - widget: 77227878 number hit-points-maximum 10 (rank: 1)
              - widget: 77227980 number hit-points-temporary 0 (rank: 2)
            - widget: 77227982 skill-4 Fortitude 5 (rank: 1), formula: constitution + proficiency pips
              - widget: 77228020 checkbox fortitude-trained (rank: 1, true)
              - widget: 77228019 checkbox fortitude-expert (rank: 2, true)
              - widget: 77227884 checkbox fortitude-master (rank: 3, false)
              - widget: 77228021 checkbox fortitude-legendary (rank: 4, false)
            - widget: 77227983 skill-4 Reflex 7 (rank: 2), formula: dexterity + proficiency pips
              - widget: 77228022 checkbox reflex-trained (rank: 1, true)
              - widget: 77227885 checkbox reflex-expert (rank: 2, true)
              - widget: 77227886 checkbox reflex-master (rank: 3, true)
              - widget: 77228023 checkbox reflex-legendary (rank: 4, false)
            - widget: 77228083 skill-4 Perception 3 (rank: -1), formula: wis + proficiency pips
              - widget: 77227881 checkbox perception-trained (rank: 1, true)
              - widget: 77228001 checkbox perception-expert (rank: 2, false)
              - widget: 77227835 checkbox perception-master (rank: 3, false)
              - widget: 77227845 checkbox perception-legendary (rank: 4, false)
            - widget: 77227981 skill-4 Will 9 (rank: 3), formula: wisdom + proficiency pips
              - widget: 77227935 checkbox will-trained (rank: 1, true)
              - widget: 77227936 checkbox will-expert (rank: 2, true)
              - widget: 77227937 checkbox will-master (rank: 3, true)
              - widget: 77227938 checkbox will-legendary (rank: 4, true)
          - Right sub-column: 77227836 (section, size: 50, rank: 1)
            - widget: 77227875 number Armor Class 17 (rank: -2), formula: 10 + item-bonus + dexterity + proficiency + circumstance_bonus
            - widget: 77227879 number Speed 30 (rank: 0)
            - widget: 77227984 checkbox Raise Shield false (rank: -1)
            - widget: 77227918 health shield-hit-points 0 (rank: -6)
              - widget: 77227919 number shield-hit-points-maximum 0 (rank: 1), formula: shield_hp
            - widget: 77228053 number Shield Hardness 0 (rank: -5), formula: shield_hardness
            - widget: 77228049 number BT 0 (rank: -4), formula: broken_threshhold
        - widget: 77227953 paragraph Notes (rank: -4) [example text block]
    - widget: 77227837 checkboxes Hero Points value=1 (rank: -2)
      - widget: 77227838 number hero_points-max 3 (rank: 1)
  - Right column: 77227840 (section, size: 37.23004694835691, rank: 1)
    - title: 77227823 "Skills" (rank: 26)
      - widget: 77227998 skill-4 Acrobatics 3 (rank: -18), formula: dex + pips, message: "Acrobatics {1d20+acrobatics}"
        - widget: 77227824 checkbox acrobatics-trained (rank: 1, true)
        - widget: 77227951 checkbox acrobatics-expert (rank: 2, false)
        - widget: 77227841 checkbox acrobatics-master (rank: 3, false)
        - widget: 77227842 checkbox acrobatics-legendary (rank: 4, false)
      - widget: 77228073 skill-4 Arcana 5 (rank: -17), message, formula int + pips
        - widget: 77227942 checkbox arcana-trained (rank: 1, true)
        - widget: 77227943 checkbox arcana-expert (rank: 2, true)
        - widget: 77227848 checkbox arcana-master (rank: 3, false)
        - widget: 77227849 checkbox arcana-legendary (rank: 4, false)
      - widget: 77227999 skill-4 Athletics 7 (rank: -16), message, formula str + pips
        - widget: 77227944 checkbox athletics-trained (rank: 1, true)
        - widget: 77227945 checkbox athletics-expert (rank: 2, true)
        - widget: 77227946 checkbox athletics-master (rank: 3, true)
        - widget: 77227947 checkbox athletics-legendary (rank: 4, false)
      - widget: 77228076 skill-4 Crafting 9 (rank: -15), message, formula int + pips
        - widget: 77228004 checkbox crafting-trained (rank: 1, true)
        - widget: 77228005 checkbox crafting-expert (rank: 2, true)
        - widget: 77228006 checkbox crafting-master (rank: 3, true)
        - widget: 77228007 checkbox crafting-legendary (rank: 4, true)
      - widget: 77228077 skill-4 Deception 0 (rank: -14), message, formula cha + pips
        - widget: 77228009 checkbox deception-trained (rank: 1, false)
        - widget: 77228010 checkbox deception-expert (rank: 2, false)
        - widget: 77227850 checkbox deception-master (rank: 3, false)
        - widget: 77228008 checkbox deception-legendary (rank: 4, false)
      - widget: 77228078 skill-4 Diplomacy 0 (rank: -13), message, formula cha + pips
        - widget: 77228012 checkbox diplomacy-trained (rank: 1, false)
        - widget: 77227851 checkbox diplomacy-expert (rank: 2, false)
        - widget: 77227852 checkbox diplomacy-master (rank: 3, false)
        - widget: 77228011 checkbox diplomacy-legendary (rank: 4, false)
      - widget: 77228079 skill-4 Intimidation 0 (rank: -12), message, formula cha + pips
        - widget: 77227825 checkbox intimidation-trained (rank: 1, false)
        - widget: 77227826 checkbox intimidation-expert (rank: 2, false)
        - widget: 77227827 checkbox intimidation-master (rank: 3, false)
        - widget: 77227989 checkbox intimidation-legendary (rank: 4, false)
      - widget: 77228080 skill-4 Medicine 0 (rank: -7), message, formula wis + pips
        - widget: 77227828 checkbox medicine-trained (rank: 1, false)
        - widget: 77227829 checkbox medicine-expert (rank: 2, false)
        - widget: 77228013 checkbox medicine-master (rank: 3, false)
        - widget: 77228014 checkbox medicine-legendary (rank: 4, false)
      - widget: 77228074 skill-4 Nature 0 (rank: -6), message, formula wis + pips
        - widget: 77227830 checkbox nature-trained (rank: 1, false)
        - widget: 77227831 checkbox nature-expert (rank: 2, false)
        - widget: 77227832 checkbox nature-master (rank: 3, false)
        - widget: 77228085 checkbox nature-legendary (rank: 4, false)
      - widget: 77228082 skill-4 Occultism 0 (rank: -5), message, formula int + pips
        - widget: 77227833 checkbox occultism-trained (rank: 1, false)
        - widget: 77227834 checkbox occultism-expert (rank: 2, false)
        - widget: 77227869 checkbox occultism-master (rank: 3, false)
        - widget: 77227843 checkbox occultism-legendary (rank: 4, false)
      - widget: 77228081 skill-4 Society 0 (rank: -2), message, formula int + pips
        - widget: 77227871 checkbox society-trained (rank: 1, false)
        - widget: 77227872 checkbox society-expert (rank: 2, false)
        - widget: 77227873 checkbox society-master (rank: 3, false)
        - widget: 77227857 checkbox society-legendary (rank: 4, false)
      - widget: 77228075 skill-4 Stealth 0 (rank: -1), message, formula dex + pips
        - widget: 77227931 checkbox stealth-trained (rank: 1, false)
        - widget: 77227956 checkbox stealth-expert (rank: 2, false)
        - widget: 77227858 checkbox stealth-master (rank: 3, false)
        - widget: 77227991 checkbox stealth-legendary (rank: 4, false)
      - widget: 77228000 skill-4 Religion 0 (rank: -3), message, formula wis + pips
        - widget: 77227853 checkbox religion-trained (rank: 1, false)
        - widget: 77227854 checkbox religion-expert (rank: 2, false)
        - widget: 77227855 checkbox religion-master (rank: 3, false)
        - widget: 77227856 checkbox religion-legendary (rank: 4, false)
      - widget: 77227996 skill-4 Survival 0 (rank: 1), message, formula wis + pips
        - widget: 77227957 checkbox survival-trained (rank: 1, false)
        - widget: 77227958 checkbox survival-expert (rank: 2, false)
        - widget: 77227954 checkbox survival-master (rank: 3, false)
        - widget: 77227955 checkbox survival-legendary (rank: 4, false)
      - widget: 77227870 skill-4 Performance 0 (rank: -4), message, formula cha + pips
        - widget: 77227976 checkbox performance-trained (rank: 1, false)
        - widget: 77227977 checkbox performance-expert (rank: 2, false)
        - widget: 77227978 checkbox performance-master (rank: 3, false)
        - widget: 77227979 checkbox performance-legendary (rank: 4, false)
      - title: 77228093 "Lores" (rank: 3)
        - widget: 77228054 skill-4 Example 0 (rank: 0), message, formula int + pips
          - widget: 77228015 checkbox example-trained (rank: 1, false)
          - widget: 77228016 checkbox example-expert (rank: 2, false)
          - widget: 77228017 checkbox example-master (rank: 3, false)
          - widget: 77228018 checkbox example-legendary (rank: 4, false)
    - widget: 77228084 appearance (rank: 27) — portrait gallery (player-managed)

---

## Inventory tab — id: 77228044 (tab-section, value: "Inventory", rank: -3)
- container: 77227861 (horizontal-section, rank: 1)
  - Left column: 77227862 (section, size: 50, rank: 0)
    - title: 77227860 "Weapon Proficiencies" (rank: 0)
      - widget: 77228002 skill-4 simple weapons 5 (rank: 0), pips
        - 77227888 trained (1, true), 77227889 expert (2, true), 77227890 master (3, false), 77227891 legendary (4, false)
      - widget: 77228003 skill-4 martial weapons 7 (rank: 1), pips
        - 77227892 trained (1, true), 77227893 expert (2, true), 77227894 master (3, true), 77227895 legendary (4, false)
      - widget: 77227925 skill-4 Advanced Weapons 9 (rank: 3), pips
        - 77227921 trained (1, true), 77227922 expert (2, true), 77227923 master (3, true), 77227924 legendary (4, true)
      - widget: 77227865 skill-4 unarmed attacks 3 (rank: -1), pips
        - 77227866 trained (1, true), 77227867 expert (2, false), 77227868 master (3, false), 77227887 legendary (4, false)
    - title: 77227920 "Weapons" (rank: 1)
      - widget: 77227959 message Staff (rank: 0) with icon and strike/damage line
    - title: 77227962 "On Person" (rank: 2)
      - widget: 77227975 checkboxes consumable value=0 (rank: -3)
        - 77227987 number consumable-max 2 (rank: 1)
      - widget: 77227967 message Consumable (2 max uses) (rank: -2)
      - widget: 77228086 checkboxes "Scroll of Enlarge" value=1 (rank: 0)
        - 77227988 number scroll_of_enlarge-max 1 (rank: 1)
      - widget: 77227968 message Scroll of Enlarge (rank: 1)
  - Right column: 77227863 (section, size: 50, rank: 1)
    - title: 77227926 "Armor" (rank: -2)
      - widget: 77227927 number Item-bonus 0 (rank: 0)
      - widget: 77227928 number dex-cap 0 (rank: 1)
      - widget: 77227929 number proficiency 7 (rank: 2), formula: medium
      - widget: 77227961 number Circumstance Bonus 0 (rank: 3)
      - widget: 77227960 heading "[ARMOR]" (rank: -1)
    - widget: 77227930 heading "[SHIELD]" (rank: -1)
    - widget: 77228052 number Shield Hardness 0 (rank: 0)
    - widget: 77228050 number Shield HP 0 (rank: 1)
    - widget: 77228051 number Broken Threshhold 0 (rank: 2)
    - title: 77227864 "Armor Proficiency" (rank: -3)
      - widget: 77227896 skill-4 Unarmoured 3 (rank: 0)
        - 77227897 trained, 77227898 expert, 77227899 master, 77227900 legendary
      - widget: 77227901 skill-4 light 5 (rank: 1)
        - 77227902 trained, 77227903 expert, 77227904 master, 77227905 legendary
      - widget: 77227906 skill-4 medium 7 (rank: 2)
        - 77227907 trained, 77227908 expert, 77227909 master, 77227910 legendary
      - widget: 77227990 skill-4 heavy 9 (rank: 3)
        - 77227913 trained, 77227914 expert, 77227915 master, 77227916 legendary
    - title: 77227966 "Backpack" (rank: 3)
      - widget: 77227969 paragraph "<ul><li>Wonderful Figurine (Onyx Dog)</li></ul>" (rank: 0)
- container: 77227963 (horizontal-section, rank: 2)
  - Left: 77227964 (section, size: 50, rank: 0)
  - Right: 77227965 (section, size: 50, rank: 1)

---

## Feats tab — id: 77228046 (tab-section, value: "Feats", rank: -2)
- container: 77227973 (section, rank: 0, size: 50)
  - [No children in export]
- container: 77227974 (section, rank: 1, size: 50)
  - container: 77228056 (horizontal-section, rank: 0)
    - Left: 77228057 (section, size: 50, rank: 0)
      - title: 77227985 "Active Abilities" (rank: -1)
      - widget: 77228087 message "Shield Block" (rank: 1)
      - widget: 77228088 message "Treat Wounds using Nature" (rank: 2)
    - Right: 77228058 (section, size: 50, rank: 1)
      - title: 77227986 "Passive Abilities" (rank: 0)
      - widget: 77228055 message "Gourd Leshy" (rank: -1)
      - widget: 77228025 message "Wild Empathy" (rank: 0)
      - widget: 77228026 message "Natural Medicine" (rank: 2)
      - widget: 77227993 message "Experienced Tracker" (rank: 3)
- container: 77227970 (horizontal-section, rank: 1)
  - Left: 77227971 (section, size: 50, rank: 0)
    - widget: 77228024 paragraph feats overview (rank: -1)
  - Right: 77227972 (section, size: 50, rank: 1)
    - [No children in export]

---

## Spells tab — id: 77228045 (tab-section, value: "Spells", rank: 0)
- title: 77227992 "Spellcasting" (rank: -1)
  - container: 77228036 (horizontal-section, rank: 0)
    - Left: 77228028 (section, size: 50, rank: 0)
      - title: 77228030 "Primal Prepared Spells" (rank: 0)
        - widget: 77228037 number "Primal Spellcasting DC" 10 (rank: -8), formula: class_dc
        - title: 77228033 "Cantrips (2nd level)" (rank: -7)
          - widget: 77228065 message "Acid Splash" (rank: 0)
          - widget: 77228090 message "Guidance" (rank: 1)
          - widget: 77228091 message "Ray of Frost" (rank: 2)
          - widget: 77228092 message "Stabilize" (rank: 3)
          - widget: 77228039 message "Tanglefoot" (rank: 4)
        - title: 77228034 "First Level Spells" (rank: -2)
          - widget: 77228040 message "Fleet Step" (rank: 0)
          - widget: 77228067 message "Heal" (rank: 2)
          - widget: 77228062 checkbox "Slot 1 - Fleet Step" (rank: -3)
          - widget: 77228064 checkbox "Slot 2 - Heal" (rank: -2)
          - widget: 77228066 checkbox "Slot 3 - Shillelagh" (rank: -1)
          - widget: 77228041 message "Shillelagh" (rank: 4)
        - title: 77228035 "Second Level Spells" (rank: 3)
          - widget: 77228042 message "Acid Arrow" (rank: 1)
          - widget: 77228043 message "Entangle" (rank: 3)
          - widget: 77228061 checkbox "Slot 1 - Acid Arrow" (rank: -1)
          - widget: 77228063 checkbox "Slot 2 - Entangle" (rank: 0)
    - Right: 77228029 (section, size: 50, rank: 1)
      - title: 77228032 "Focus Spells" (rank: 0)
        - widget: 77228059 number "Focus Spellcasting DC" 10 (rank: -6), formula: class_dc
        - title: 77228060 "Druid Order Spells" (rank: -5)
          - widget: 77228031 checkboxes "Focus Points" value=0 (rank: 0)
            - widget: 77228038 number "focus_points-max" 1 (rank: 1)
        - widget: 77228089 message "GoodBerry" (rank: -1)

---

## Background tab — id: 77228048 (tab-section, value: "Background", rank: 2)
- widget: 77228027 paragraph (rank: 0) [background narrative]

---

## Rebuild checklist (creation order)
1) Create tabs (tab-section): Character 77228047, Inventory 77228044, Feats 77228046, Spells 77228045, Background 77228048.
2) Character tab:
   - Add 77227847 horizontal-section; add sections 77227941 (left, size ~62.77) and 77227840 (right, size ~37.23).
   - Left column: add Character Details 77227917 and its children (text/number fields). Add Ability Scores 77227822 and abilities with nested score numbers. Under Ability Scores add Combat Info 77228069 → add horizontal-section 77227882 with sub-sections 77227883/77227836 and their children as listed. Add Notes paragraph. Add Hero Points widget to the left column (parent 77227941).
   - Right column: add Skills 77227823 and all skill-4 groups with pip checkboxes. Add Lores 77228093 and example lore 77228054. Add Appearance 77228084.
3) Inventory tab:
   - Add 77227861 horizontal-section with sections 77227862 (left) and 77227863 (right).
   - Left: Weapon Proficiencies 77227860 with skill-4 groups, Weapons 77227920 with message items, On Person 77227962 with messages/checkboxes.
   - Right: Armor 77227926 with numbers/headings, Shield stat numbers, Armor Proficiency 77227864 with skill-4 groups, Backpack 77227966.
   - Add 77227963 horizontal-section with sections 77227964/77227965 (placeholders in current export).
4) Feats tab:
   - Add sections 77227973 and 77227974; inside 77227974 add horizontal-section 77228056 with sections 77228057 (Active Abilities) and 77228058 (Passive Abilities) and messages. Add 77227970 horizontal-section with sections 77227971/77227972 and the overview paragraph in 77227971.
5) Spells tab:
   - Add title 77227992. Add horizontal-section 77228036 with sections 77228028 (left) and 77228029 (right).
   - Left: Primal Prepared Spells 77228030, add DC, then Cantrips/First/Second titles and child messages/slot checkboxes in rank order.
   - Right: Focus Spells 77228032, add DC, then Druid Order Spells 77228060 containing Focus Points checkboxes + max; add GoodBerry message under Focus Spells.
6) Background tab:
   - Add the background paragraph.