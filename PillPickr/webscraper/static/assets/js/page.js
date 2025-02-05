function fn() {
  function safeGetRadioValue(name) {
    var radios = document.getElementsByName(name);
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return null;
  }

  var age = safeGetRadioValue('customRadioInline1-1-2');
  var smoking = safeGetRadioValue('customRadioInline1-3-4');
  var conditions = document.querySelectorAll('input[name="condtions1"]:checked');
  var effects = document.querySelectorAll('input[name="effects1"]:checked');
  var experiences = document.querySelectorAll('input[name="experiences1"]:checked');
  var medications = document.querySelectorAll('input[name="meds1"]:checked');
  var periodPreference = safeGetRadioValue('customRadioInline');

  var conditionMap = {
    'pcos': conditions[0] ? true : false,
    'pdd': conditions[1] ? true : false,
    'endo': conditions[2] ? true : false,
    'acne': conditions[3] ? true : false
  };

  var effectMap = {
    'hair': effects[0] ? true : false,
    'depress': effects[1] ? true : false,
    'mood': effects[2] ? true : false,
    'nausea': effects[3] ? true : false,
    'bleed': effects[4] ? true : false
  };

  var experienceMap = {
    'clots': experiences[0] ? true : false,
    'cancer': experiences[1] ? true : false,
    'heart': experiences[2] ? true : false,
    'migraines': experiences[3] ? true : false,
    'pressure': experiences[4] ? true : false,
    'diabetes': experiences[5] ? true : false
  };

  var medicationMap = {
    'clona': medications[0] ? true : false,
    'topi': medications[1] ? true : false,
    'mela': medications[2] ? true : false,
    'pred': medications[3] ? true : false,
    'lora': medications[4] ? true : false,
    'amit': medications[5] ? true : false,
    'metform': medications[6] ? true : false
  };

  // Ensure URLs object is available
  if (typeof urls !== 'undefined') {
    if ((age === '35+' && smoking === 'yes') || Object.values(experienceMap).some(Boolean)) {
      window.location.href = urls.minipill;
    } else if (conditionMap.endo) {
      window.location.href = urls.previfem;
    } else if (conditionMap.pcos) {
      window.location.href = urls.alesse;
    } else if (conditionMap.pdd) {
      window.location.href = urls.beyaz;
    } else if (conditionMap.acne) {
      window.location.href = medicationMap.topi ? urls.gianvi : urls.ocella;
    } else if (periodPreference === 'skip') {
      window.location.href = Math.random() > 0.5 ? urls.seasonique : urls.seasonale;
    } else if (Object.values(medicationMap).some(Boolean)) {
      window.location.href = urls.velivet;
    } else if (Object.values(effectMap).some(Boolean)) {
      window.location.href = urls.apri;
    } else {
      window.location.href = urls.lybrel;
    }
  } else {
    console.error("URLs object is not defined. Ensure survey.html passes Flask URLs correctly.");
  }
}
