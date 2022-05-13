
//* Request data menggunakan vanilla javascript
function getData(url, success, error){
    const req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(req.readyState === 4){
            if(req.status === 200){
                success(req.response);
            }else if(req.status === 404){
                alert(error.responseText);
            }
        }
    }

    req.open('get', url);
    req.send();

}

getData('http://myapp.test/api/airco', success => {
    const data = JSON.parse(success);
    let card = '';
    for([e,m] of data.entries()){
        card += funcCard(m);
    }
    document.querySelector('.card-cont').innerHTML = card;
    const btnD = document.querySelectorAll('.btn-details');
    btnD.forEach(btnDet => {
        btnDet.addEventListener('click', function() {
            const dataId = this.dataset.id;
            const reqDet = new XMLHttpRequest();
            reqDet.onreadystatechange = function() {
                if(reqDet.readyState === 4){
                    if(reqDet.status === 200){
                        let cardDet = '';
                        const dataDet = JSON.parse(reqDet.response);
                        cardDet += `<ul class="list-group">
                        <li class="list-group-item"><strong>Petugas Pemasangan</strong> : ${dataDet.petugas_pemasangan == null ? '' : `${dataDet.petugas_pemasangan}`}</li>
                        <li class="list-group-item"><strong>Tanggal Pemasangan</strong> : ${dataDet.tgl_pemasangan == null ? '' : `${dataDet.tgl_pemasangan}`}</li>
                        <li class="list-group-item">A third item</li>
                        <li class="list-group-item">A fourth item</li>
                        <li class="list-group-item">And a fifth one</li>
                      </ul>`;
                        document.querySelector('.modal-body').innerHTML = cardDet;                        
                    }
                }
            }
            reqDet.open('get', 'http://myapp.test/api/airco/detail/' + dataId);
            reqDet.send();
        });
    });
}, error => {
    alert(error);
});

//* Request data menggunakan modern javascript
//* Cara 1
async function getData(){
   try{
       const url = 'http://myapp.test/api/airco';
       const datas = await getFetch(url);
       updateUi(datas);
   }catch (e){
       alert(e);
   }
}
getData();

function getFetch(url){
    return fetch(url)
                .then(success => {
                    if(!success.ok){
                        throw new Error(success.statusText);
                    }else{
                        return success.json();
                    }
                })
                .then(result => {
                    if(result.Response === 'False'){
                        throw new Error(success.statusText);
                    }else{
                        return result;
                    }
                });
}

function updateUi(datas){
    let card = '';
    for(m of datas){
        card += funcCard(m);
    }
    document.querySelector('.card-cont').innerHTML = card;
    const btnDet = document.querySelectorAll('.btn-details');
    for(btnD of btnDet){
        btnD.addEventListener('click', function() {
            const dataId = this.dataset.id;
            fetch(`http://myapp.test/api/airco/detail/${dataId}`)
                .then(success => success.json())
                .then(r => {
                    let cardDet = '';
                    cardDet += updateDetail(r);
                    document.querySelector('.modal-body').innerHTML = cardDet;
                });
        })
    }
    
}


//* Request data menggunakan modern javascript
//* Cara 2
    fetch('http://myapp.test/api/airco')
        .then(success => success.json())
        .then(result => {
            let card = '';
            
            result.forEach(e => {
                card += funcCard(e);
            });
            document.querySelector('.card-cont').innerHTML = card;
            const btnDet = document.querySelectorAll('.btn-details');
            for(btn of btnDet){
                btn.addEventListener('click', function() {
                    const dataId = this.dataset.id;
                    fetch(`http://myapp.test/api/airco/detail/${dataId}`)
                        .then(s => s.json())
                        .then(r => {
                            let cardDet = '';
                            cardDet += updateDetail(r);
                            document.querySelector('.modal-body').innerHTML = cardDet;
                        });
                })
            }
        });



//* Request data menggunakan jquery
$.ajax({
    url : 'http://myapp.test/api/airco',
    success : res => {
        let card = '';
        res.forEach(e => {
            card += funcCard(e);
        });
        $('.card-cont').html(card);
        const btnDet = $('.btn-details');
        for(btnD of btnDet){
            $(btnD).on('click', function() {
                const dataId = $(this).data('id');
                $.ajax({
                    url: 'http://myapp.test/api/airco/detail/' + dataId,
                    success : r => {
                        let cardDet = '';
                        cardDet += updateDetail(r);
                        $('.modal-body').html(cardDet);
                    },
                    error : e => {
                        alert(e.statusText)
                    }
                })
            })
        }
    },
    error : e => {
        alert(e.statusText);
    }
})


function funcCard(m){
    return `<tr>    
    <td>${m.wing}</td>
    <td>${m.lantai}</td>
    <td>${m.ruangan}</td>
    <td>${m.merk}</td>
    ${m.status == "Rusak" ? `<td style="background:#E72E2E;color:white">${m.status}</td>` : `<td style="background:#32BFFF;color:white">${m.status}</td>`}
    <td>
        <a href="#" class="btn btn-info btn-details" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${m.id}">Detail</a>
    </td>
  </tr> `;
}

function updateDetail(r){
    return `<ul class="list-group">
    <li class="list-group-item"><strong>Petugas Pemasangan</strong> : ${r.petugas_pemasangan == null ? '' : `${r.petugas_pemasangan}`}</li>
    <li class="list-group-item"><strong>Tanggal Pemasangan</strong> : ${r.tgl_pemasangan == null ? '' : `${r.tgl_pemasangan}`}</li>
    <li class="list-group-item">A third item</li>
    <li class="list-group-item">A fourth item</li>
    <li class="list-group-item">And a fifth one</li>
    </ul>`;
}