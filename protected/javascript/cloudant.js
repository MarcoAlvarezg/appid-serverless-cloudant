/*
 * Web application
 */
var Url = "https://86c1ea06.us-south.apiconnect.appdomain.cloud/guestbook";
var UrlU = "https://localhost:3000/protected/api/idPayload";
var UrlI = "https://localhost:3000/protected/api/inst";
//fs file open


const USER = {
  get(){
    return $.ajax({
      type: 'GET',
      url: `${UrlU}`,
      dataType: 'json'
    });
  },
}
// crear variables de ambiente que almacenas el HOST_BACKEND
// y la consumes con processs.env.HOST_BACKEND
// puedes usar IBMcloudenv o el https://www.npmjs.com/package/dotenv

const INST = {
  get(){
    return $.ajax({
      type: 'GET',
      url: `${UrlI}`,
      dataType: 'json'
    });
  },
}

const cloudantConnection = {
  // retrieve the existing guestbook entries
  get() {
    return $.ajax({
      type: 'GET',
      url: `${Url}/entries`,
      dataType: 'json'
    });
  },
  // add a single guestbook entry
  add(user, actType, hours, loc, students, ins, raiting, comment) {
    /* actType = "a"
     hours ="a"
     loc ="a"
     students ="a"
     raiting="a"
     comment="a" */
    console.log('Sending', user, actType, hours, loc, students, ins, raiting, comment)
    return fetch(`${Url}/entries`,{
        method: "POST",
        body: JSON.stringify({
            user,
            actType,
            hours,
            loc,
            students,
            ins,
            rating: raiting,
            comment
          }),
          headers: {
            'Content-Type': 'application/json'
          }
     })//.then(res => res.json())
    // .catch(error => console.error('Error:', error))
    // .then(response => console.log('Success:', response));
    // return $.ajax({
    //   type: 'POST',
    //   url: `${Url}/entries`,
    //  /* auth:{
    //     username: '878522d7-3ae4-4aa6-8e0a-426463ef2478', 
    //     password: 'nfjt22PuDGPJ3b2EnYWD8pS2GnEg7fWBDZ9jU0DmjUecrNDrj2h7chM11SafCG1h'
    //   },*/
    //   ContentType: 'application/json; charset=utf-8',
    //   data: JSON.stringify({
    //     actType,
    //     hours,
    //     loc,
    //     students,
    //     rating: raiting,
    //     comment
    //   }),
    //   dataType: 'json',
    // });
  }
};
var x;
var i;
var h;
var eh;

(function() {

  let entriesTemplate;

  function prepareTemplates() {
    entriesTemplate = Handlebars.compile($('#entries-template').html());
  }

  // retrieve entries and update the UI
  function loadEntries() {
    USER.get().done(function(rest){
      if(!rest){
        return
      }
      x = rest.email;
      });
    INST.get().done(function(res){
      if(!res){
        //console.log("nada por aqui");
        return;
      }
      i = res.docs;
    });
    cloudantConnection.get().done(function(result) {
      if (!result.entries) {
        return;
      }
      var arr = result.entries;
      //console.log(arr);
      //console.log(x);
      //console.log(i); 
      // Hacer un $.each sobre el arreglo de instituciones
      // para cada elemento, vas a aplicar un .filter() al results.entries
      // referencia: https://www.w3schools.com/jsref/jsref_filter.asp
      // filter te regreesa un nuevo arreglo con el resultado del filtro
      // a cada arreglo, le aplicas un .reduce y el resultado lo puedes
      // hacer push() a un arreglo de resultados
      //para horas del usuario
      $.each(arr, function(key, entry){
       // console.log(entry);
        function checkU(entry){
          return entry.name==x;
        }
        h = arr.filter(checkU);
        })
        //console.log(h);
        var totalH = h.reduce((sum, value) => (typeof value.hours == "number" ? sum + value.hours : sum), 0);
        //console.log(totalH + " horas");
        $("#horasReg").html(totalH);
        //para horas de las instituciones i para inst arr para todo el arreglo
        $.each(i, function(key, entry){
          //console.log(entry.nombre);
          $.each(arr, function(k,e){
            function checkI(e){
              return e.institucion==entry.nombre;
            }
            eh = arr.filter(checkI);
          })
        var totalEH = eh.reduce((sum, value) => (typeof value.hours == "number" ? sum + value.hours : sum), 0);
        //console.log(entry._id + " = " + totalEH +"h");
        $("#"+entry._id).html(totalEH+" / 1000");       
        })
      }
      );
    }

  // intercept the click on the submit button, add the guestbook entry and
  // reload entries on success
  $(document).on('submit', '#addActivity', function(e) {
    e.preventDefault();
    cloudantConnection.add(
      $('#user').val().trim(),
      $('#actType').val().trim(),
      $('#hours').val(),
      $('#loc').val().trim(),
      $('#students').val().trim(),
      $('#ins').val().trim(),
      $('#rat').val().trim(),
      $('#comment').val().trim()
    ).then(function(result) {
      // reload entries
      document.getElementById("addActivity").reset();
      alert("Actividad registrada correctamente");
      prepareTemplates();
      loadEntries();
    }).catch(function(error) {
      alert("Verifique sus datos ingresados");
      console.log(error);
    });
  });

  $(document).ready(function() {
    //prepareTemplates();
    loadEntries();
  });
})();
