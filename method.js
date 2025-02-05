document.addEventListener('DOMContentLoaded', function() {
    var bodyControl = document.querySelector('.body-control-content');
    bodyControl.classList.add('show'); // Add show class when page loads

    var boxesContainer = document.querySelector('.boxes');
    var images = ['1.jpeg', '2.jpeg', '3.jpeg', '4.webp', '5.jpg', '6.jpeg', '7.jpeg', '8.jpeg', '9.png', '10.jpeg', '11.jpeg', '12.jpeg', 'image13.jpg', 'image14.jpg', 'image15.jpg', 'image16.jpg', 'image17.jpg', 'image18.jpg'];
    var content = [
        { heading: 'Birth Control Implant', body: '99% effective <br> Lasts up to 5 years', link: 'birthControlImplant.html' },
        { heading: 'IUD', body: '99% effective <br>Lasts up to 3-12 years ', link: 'IUD.html' },
        {heading: 'Birth Control Vaginal Ring', body:'93% effective <br> Put in and take out once a month',link:'VaginalRing.html'},
        {heading:'Birth Control Patch',body:'93% effective <br> Replace weekly',link:'ControlPatch.html'},
        {heading:'Birth Control Pill',body:'93% effective <br> Take daily',link:'controlPill.html'},
        {heading: 'Condom',body:'87% effective <br> Use every time',link:'condom.html'},
        {heading:'Diaphragm',body:'83% effective <br> Use every time',link:'diaphragm.html'},
        {heading:'Fertility Awareness(FAMs)',body:'77-98% effective <br> Use daily',link:'fertilityawareness.html'},
        {heading:'Sterilization(Tube Ligation)',body:'99% effective <br> Lasts for life',link:'sterilization.html'},
        {heading:'Vasectomy',body:'99% effective <br> Lasts for life',link:'vasectomy.html'},
        {heading:'Birth Control Shot',body:'96% effective <br> Get every 3 months',link:'ControlShot.html'},
        {heading:'Cervical Cap',body:'71-86 % effective <br> Use every time',link:'cervicalCap.html'}
        // Add more objects for additional boxes as needed
    ];

    for (var i = 0; i < 12; i++) {
        var box = document.createElement('div');
        box.classList.add('box');

        // Create top section with image
        var topSection = document.createElement('div');
        topSection.classList.add('section', 'upper-section'); // Add upper-section class

        var image = document.createElement('img');
        image.src = images[i];

        topSection.appendChild(image);

         // Create bottom section with heading, body text, and link
         var bottomSection = document.createElement('div');
         bottomSection.classList.add('section', 'lower-section');
 
         var heading = document.createElement('h3');
         heading.textContent = content[i].heading; // Access heading using index i
 
         var bodyText = document.createElement('p');
         bodyText.innerHTML = content[i].body; 
 
         var learnMoreLink = document.createElement('a');
         learnMoreLink.textContent = 'LEARN MORE';
         learnMoreLink.href = content[i].link; // Access link using index i
 
         // Apply CSS styles to display elements vertically
         heading.style.display = 'block';
         bodyText.style.display = 'block';
         learnMoreLink.style.display = 'block';
 
         bottomSection.appendChild(heading);
         bottomSection.appendChild(bodyText);
         bottomSection.appendChild(learnMoreLink);
 

        box.appendChild(topSection);
        box.appendChild(bottomSection);

        boxesContainer.appendChild(box);
    }
});

