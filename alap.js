document.addEventListener("DOMContentLoaded",adatokbetoltese());
//--------------listák dekl.
let jatekoslista=[];
let tornalista=[];
let gyozelemlista=[];
async function adatokbetoltese()//--------------json-->listákba
{
    let jvalasz=await fetch("jatekoslista.js");
    jatekoslista=await jvalasz.json();
    console.log(jatekoslista);

    let tvalasz=await fetch("tornalista.js");
    tornalista=await tvalasz.json();
    console.log(tornalista);

    let gyvalasz=await fetch("gyozelemlista.js");
    gyozelemlista=await gyvalasz.json();
    console.log(gyozelemlista);

    tablazat_megjelenites(gyozelemlista);

    //--------------lenyíló listák feltöltése (név,torna,év)
    let szoveg="";
    for(const j of jatekoslista)szoveg+=`<option value="${j.jatekos_id}">${j.jatekos_nev}</option>`;
    document.getElementById("jatekosneve").innerHTML=szoveg;
     szoveg="";
    for(const j of tornalista)szoveg+=`<option value="${j.torna_id}">${j.torna_nev}</option>`;
    document.getElementById("tornaneve").innerHTML=szoveg;
    let mai_ev=new Date().getFullYear();
    szoveg="";
    for(let i=mai_ev;i>=1900;i--)szoveg+=`<option value="${i}">${i}</option>`;
    document.getElementById("evszam").innerHTML=szoveg;
}
//--------------új tornagyőztes rögzítése(játékos, torna-év egyedi legyen )
function gyoztesadatrogzites()
{
    document.getElementById("gyoztessiker").textContent="";
    const jatekosId=parseInt(document.getElementById("jatekosneve").value);
    const tornaId=parseInt(document.getElementById("tornaneve").value);
    const ev=parseInt(document.getElementById("evszam").value);
    const marLetezik=gyozelemlista.some(g=>g.tornaid===tornaId&&g.ev===ev);
    if(marLetezik){
        document.getElementById("gyoztessiker").textContent="Ez a torna-év már rögzítve van";
        return;
    }
    gyozelemlista.push({jatekosid:jatekosId,tornaid:tornaId,ev});
    document.getElementById("gyoztessiker").textContent="Sikerült a felvitel";
    tablazat_megjelenites(gyozelemlista);
}
//--------------felvitt adat törlése a listából
function torles(index)
{
    if(confirm("Biztosan törlöd?")){
        gyozelemlista.splice(index,1);
        tablazat_megjelenites(gyozelemlista);
    }
}
//--------------adatok megjelenítése táblázatban (év, játékos, nemzetiség, torna)
function tablazat_megjelenites(adatok)
{
    const tabla=document.getElementById("tablazat");
    tabla.innerHTML="";
    adatok.forEach((gyoztes,index) => {
        const jatekos=jatekoslista.find(j=>j.jatekos_id===gyoztes.jatekosid);
        const torna=tornalista.find(t=>t.torna_id===gyoztes.tornaid);
        const tr=document.createElement("tr");
        tr.innerHTML=`
            <th>${gyoztes.ev}</th>
            <th>${jatekos?jatekos.jatekos_nev:"?"}</th>
            <th>${jatekos?jatekos.jatekos_nemzetiseg:"?"}</th>
            <th>${torna?torna.torna_nev:"?"}</th>
            <th>
            <button class="btn btn-danger" onclick="torles(${index})">Törlés</button>
            </th>
        `;
        tabla.appendChild(tr);
    });
}

//--------------keresés

function kereses(){
    const keresendo = document.getElementById('keresendo').value.toLowerCase();
    if(keresendo===''){
        tablazat_megjelenites(gyozelemlista);
        return;
    }
    const szurtLista = gyozelemlista.filter(gyoztes=>{
        const jatekos = jatekoslista.find(j=>j.jatekos_id===gyoztes.jatekosid);
        const torna = jatekoslista.find(t=>t.torna_id===gyoztes.tornaid);
        return(
            gyoztes.ev.toString().includes(keresendo) || 
            (jatekos && jatekos.jatekos_nev.toLowerCase().includes(keresendo)) || 
            (jatekos && jatekos.jatekos_nemzetiseg.toLowerCase().includes(keresendo)) || 
            (torna && torna.torna_nev.toLowerCase().includes(keresendo))
        );
    });
    tablazat_megjelenites(szurtLista);
    document.getElementById('keresendo').value = '';
}

//--------------Új játékos rögzítés

function ujjatekosrogzites(){
    document.getElementById('ujjatekossiker').innerHTML='';
    const nev = document.getElementById('ujjatekosnev').value.trim();
    const nemzetiseg = document.getElementById('ujjatekosnemzetiseg').value.trim();
    if(nev==="" || nemzetiseg===""){
        document.getElementById('ujjatekossiker').innerHTML='A név és nemzetiség kötelező!';
        return;
    }
    const ujid=Math.max(...jatekoslista.map(j=>j.jatekos_id))+1
    const ujjatekos={
        jatekos_id:ujid,
        jatekos_nev:nev,
        jatekos_nemzetiseg:nemzetiseg
    }
    jatekoslista.push(ujjatekos);
    document.getElementById('ujjatekossiker').innerHTML='A felvitel sikerült.';
    const select=document.getElementById('jatekosneve');
    if(select){
        const option = document.createElement("option");
        option.value=ujjatekos.jatekos_id;
        option.text=ujjatekos.jatekos_nev;
        select.appendChild(option);
    }
    document.getElementById('ujjatekosnev').value='';
    document.getElementById('ujjatekosnemzetiseg').value='';
}



//--------------Új torna rögzítés

function ujtornarogzites(){
    const ujtornasiker=document.getElementById('ujtornasiker');
    const ujtornanev = document.getElementById('ujtornanev').value.trim();
    if(ujtornanev===""){
        document.getElementById('ujtornasiker').innerHTML='A tornanév kötelező!';
        return;
    }
    const ujid=Math.max(...tornalista.map(j=>j.torna_id))+1
    const ujtorna={
        torna_id:ujid,
        torna_nev:ujtornanev,
    }
    tornalista.push(ujtorna);
    document.getElementById('ujtornasiker').innerHTML='A felvitel sikerült.';
    const select=document.getElementById('tornaneve');
    if(select){
        const option = document.createElement("option");
        option.value=ujtorna.torna_id;
        option.text=ujtorna.torna_nev;
        select.appendChild(option);
    }
    document.getElementById('ujtornanev').value='';
}