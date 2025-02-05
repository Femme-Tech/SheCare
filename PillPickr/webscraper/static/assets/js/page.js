function fn() {
    // Safe radio button selection function
    function safeGetRadioValue(name) {
        var radios = document.getElementsByName(name);
        if (!radios || radios.length === 0) {
            console.warn(`No radio buttons found for name: ${name}`);
            return null;
        }
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i].value;
            }
        }
        return null;
    }

    // Variables to store selected values
    var age = safeGetRadioValue('customRadioInline1-1-2');
    var smoking = safeGetRadioValue('customRadioInline1-3-4');
    var conditions = document.querySelectorAll('input[name="condtions1"]:checked');
    var effects = document.querySelectorAll('input[name="effects1"]:checked');
    var experiences = document.querySelectorAll('input[name="experiences1"]:checked');
    var medications = document.querySelectorAll('input[name="meds1"]:checked');
    var periodPreference = safeGetRadioValue('customRadioInline');

    // Condition mapping
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

    // Routing logic
    if ((age === '35+' && smoking === 'yes') || Object.values(experienceMap).some(Boolean)) {
        <a href="{{ url_for('minipill') }}">Get Result</a>

    }
    else if (conditionMap.endo) {
        <a href="{{ url_for('previfem') }}">Get Result</a>

    }
    else if (conditionMap.pcos) {
        <a href="{{ url_for('alesse') }}">Get Result</a>

    }
    else if (conditionMap.pdd) {
        <a href="{{ url_for('beyaz') }}">Get Result</a>

    }
    else if (conditionMap.acne) {
        <a href = medicationMap.topi ? "{{ url_for('gianvi') }}" : "{{ url_for('ocella') }}">Get Result</a>;
    }
    else if (periodPreference === 'skip') {
        <a href = Math.random() > 0.5 ? "{{ url_for('seasonique') }}" : "{{ url_for('seasonale') }}">Get Result</a>;
    }
    else if (Object.values(medicationMap).some(Boolean)) {
        <a href="{{ url_for('velivet') }}">Get result</a>

    }
    else if (Object.values(effectMap).some(Boolean)) {
        <a href="{{ url_for('apri') }}">Get Result</a>

    }
    else {
        <a href="{{ url_for('lybrel') }}">Get Result</a>

    }
}
