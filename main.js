var editID = null;
let editIDx = null;

newUserBtn = document.querySelector(".newUser")
submitBtn = document.querySelector(".submit")
modalTitle = document.querySelector("#userForm .modal-title")
imgInput = document.querySelector(".img")
file = document.getElementById("imgInput")
form = document.getElementById("myForm")
modalx = document.querySelector("#userForm")

let getData = localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')) : []



document.addEventListener('DOMContentLoaded', function () {
  visualiza()
})




//--------------------------visualizar TABELA---------------------------------
function visualiza() {
  fetch(`http://localhost:3000/carros`)
    .then(resposta => resposta.json())
    .then(dadosCarros => {
      document.getElementById('data').innerHTML = ''

      dadosCarros.map(function (carro) {
        document.getElementById('data').innerHTML += `
                  <tr>
                      <td>${carro.id}</td>
                      <td><img src="${carro.imagem}" alt="" width="40" height="40"></td>
                      <td>${carro.placa}</td>
                      <td>${carro.cor}</td>
                      <td>${carro.modelo}</td>
                       <td>
                      <button type="button btn-sm" onclick="visualizarCarros('${carro.id}')" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#readData"><i class="bi bi-eye"></i> Visualizar </button>
                      <button type="button btn-sm" onclick="editarCarros('${carro.id}', '${carro.placa}', '${carro.cor}', '${carro.modelo}')" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#userForm" ><i class="bi bi-pencil-square"></i> Editar </button>
                      <button type="button btn-sm" onclick="excluirCarros('${carro.id}')" class="btn btn-danger"><i class="bi bi-trash"></i>Excluir </button>
                      </td>
                  <tr/>
              `
      })
    })
}


//--------------------------adicionar carros----------------------------------



newUserBtn.addEventListener('click', () => {
  submitBtn.innerText = 'CADASTRA',
    modalTitle.innerText = "CADASTRA CARROS"
  isEdit = false
  imgInput.src = "./image/Profile Icon.webp"
  limparFormulario()
})


document.getElementById("cadastra").addEventListener("click", function () {

  let imagemSrc = imgInput.src == undefined ? "./image/Profile Icon.webp" : imgInput.src;
  let placa = document.getElementById("idplaca").value
  let cor = document.getElementById("idcor").value
  let modelo = document.getElementById("idmodelo").value



  if (!placa) {

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Preencha a placa!",
      });
    return
  }
  if (!cor) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Preencha a cor!",
      });
    return
  }
  if (!modelo) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Preencha o modelo!",
      });
    return
  }

  let body = {
    imagem: imagemSrc,
    placa: placa,
    cor: cor,
    modelo: modelo
  }

  if (editID != null) {
    fetch(`http://localhost:3000/carros/${editID}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    })
      .then(resposta => resposta.json())
      .then(usuario => {
        visualiza()
        limparFormulario()
        imgInput.src = "./image/Profile Icon.webp"
        document.getElementById('cadastra').innerText = "Cadastrar"
        editID = null
        Swal.fire({
          title: 'Atualizado com sucesso',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
        })


      })
    // FECHA MODAL


    fechamodal()
    visualiza()



    return;
  }


  function fechamodal() {

    modalx.style.display = "none"
    document.querySelector(".modal-backdrop").remove()
    visualiza()


  }

  fetch(`http://localhost:3000/carros`, {
    method: 'POST',
    body: JSON.stringify(body)
  })
    .then(resposta => resposta.json())
    .then(usuario => {
      Swal.fire({
        title: 'Cadastrado com sucesso',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
      })
      visualiza()
      limparFormulario()
      imgInput.src = "./image/Profile Icon.webp"
    })
})


//------------------editar carros--------------------------------------------



function editarCarros(id, placa, cor, modelo) {




  fetch(`http://localhost:3000/carros/${id}`)

    .then(resposta => resposta.json())
    .then(dadosCarros => {
      document.querySelector('.img').src = dadosCarros.imagem
      document.querySelector('.showImg').src = id
      document.querySelector("#idplaca").value = placa
      document.querySelector("#idcor").value = cor
      document.querySelector("#idmodelo").value = modelo

      editID = id;
      document.getElementById('cadastra').innerText = "Atualizar"



    })
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  let carroPlaca = document.getElementById("idplaca")
  let carroCor = document.getElementById("idcor")
  let carroModelo = document.getElementById("idmodelo")
  let imgInput = document.querySelector(".img")

  const information = {
    picture: imgInput.src == undefined ? "./carros/car2.png" : imgInput.src,
    employeePlaca: carroPlaca.value,
    employeeCor: carroCor.value,
    employeeModelo: carroModelo.value
  }

  if (!editID) {
    getData.push(information)
  }
  else {
    editIDx = false
    getData[editIDx] = information
  }

  localStorage.setItem('userProfile', JSON.stringify(getData))

  submitBtn.innerText = "OK!"
  modalTitle.innerHTML = "TABELA DE CARROS"

  visualiza()

  form.reset()

  imgInput.src = "./carros/car2.png"

  // modal.style.display = "none"
  // document.querySelector(".modal-backdrop").remove()
})



file.onchange = function () {
  if (file.files[0].size < 1000000) {  // 1MB = 1000000
    var fileReader = new FileReader();

    fileReader.onload = function (e) {
      imgUrl = e.target.result
      imgInput.src = imgUrl
    }

    fileReader.readAsDataURL(file.files[0])
  }
  else {
    Swal.fire({
      title: "ARQUIVO MUITO GRANDE!",
      text: "Escolha um arquivo menor que 1MB!",
      icon: "error",
    });
  }
}


function excluirCarros(id) {
  // LIB Sweetalert do javascript: https://sweetalert2.github.io/#examples
  Swal.fire({
    title: "Você tem certeza?",
    text: "Você não poderá reverter isso!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, excluir!"
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:3000/carros/${id}`, {
        method: 'DELETE'
      })
        .then(resposta => resposta.json())
        .then(usuario => {
          visualiza()
          Swal.fire({
            title: "Excluído com sucesso!",
            icon: "success",
            //showConfirmButton: false,
            timer: 2000


          });
        })
    }
  });
}


//--------------------------visualizar carro modal---------------------------------

function visualizarCarros(id) {
  fetch(`http://localhost:3000/carros/${id}`)
    .then(resposta => resposta.json())
    .then(dadosCarros => {
      document.querySelector('.showImg').src = dadosCarros.imagem
      document.querySelector("#idplaca_carro").value = dadosCarros.placa
      document.querySelector("#idcor_carro").value = dadosCarros.cor
      document.querySelector("#idmodelo_carro").value = dadosCarros.modelo

    })
}

//--------------------------editar carros-------------------------------------




//--------------------------deletar carros------------------------------------ 


//-------------------------- limpar formulario--------------------------------

function limparFormulario() {
  document.getElementById('idplaca').value = ''
  document.getElementById('idcor').value = ''
  document.getElementById('idmodelo').value = ''
  document.getElementById('imgInput').src = './image/Profile Icon.webp'
}


// function teste() {
//   Swal.fire({
//     title: "ARQUIVO MUITO GRANDE!",
//     text: "Escolha um arquivo menor que 1MB!",
//     icon: "error",
//   });
// }






