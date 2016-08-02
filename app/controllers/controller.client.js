
window.onload = function() {
   var form = document.querySelector("form");
   form.action = "/polls/" + window.location.pathname.substring(7) + "/vote";

   fetch('/pollapi/' + window.location.pathname.substring(7), {
      credentials: 'same-origin'
   }).then(function(response) {
      return response.json();
   }).then(function(json) {

      var doughnutData = json.options;
      var ctx = document.getElementById("chart-area").getContext("2d");
      window.myDoughnut = new Chart(ctx).Doughnut(doughnutData, {
         responsive: true
      });

      var pollName = document.querySelector('#pollName');
      var createdBy = document.querySelector('#createdBy');

      pollName.innerHTML = json.name;
      createdBy.innerHTML = json.createdBy;


      var select = document.querySelector("select")



      for (var option in doughnutData) {
         console.log(doughnutData[option].label);
         var opt = document.createElement("option");
         opt.innerHTML = doughnutData[option].label;
         opt.style.color = doughnutData[option].color;
         opt.style.fontWeight = "bolder";
         select.appendChild(opt);
      }

      document.querySelector("#fbShare").href = "https://www.facebook.com/sharer/sharer.php?u=" + decodeURIComponent(window.location);

      var customOpt = document.createElement("option");
      customOpt.innerHTML = "<% if(user){%>--Add New Option--<%}%>";
      customOpt.style.fontWeight = "bolder";
      select.appendChild(customOpt);


   })


};

document.querySelector("select").addEventListener("change", function(evt) {
   console.log(evt.target.value);
   if (evt.target.value == "--Add New Option--") {
      console.log("Its the same ooo");
      document.querySelector("#custom-option").type = "text";
   } else {
      document.querySelector("#custom-option").type = "hidden";
   }
});