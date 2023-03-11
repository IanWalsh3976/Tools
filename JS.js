 //GET data.json for client list

 const request = new XMLHttpRequest();

 request.addEventListener('readystatechange', () => {
     if (request.readyState === 4 && request.status === 200) {
         const jsonData = JSON.parse(request.responseText);
         jsonData.forEach(clientAcc => {
             const clientList = document.getElementById("clientInput");
             clientList.innerHTML += `<option>${clientAcc.client}</option>`;
         })
     }
 });

 request.open('GET', './data.json');
 request.send();

 //Create Code block and build out SQL String

 const form = document.querySelector("form");
 const code = document.querySelector(".code");

 form.addEventListener("submit", (e) => {
     e.preventDefault();

     //Grab all inputs and push to Array

     const inputArray = Array.from(document.querySelectorAll(".settings"));

     inputArray.forEach(item => {
         inputArray.push(item);
     })

     //Split out date

     const inputDate = new Date(inputArray[2].value),
         year = inputDate.getFullYear(),
         month = inputDate.getMonth() + 1,
         day = inputDate.getDate(),
         hour = inputDate.getHours(),
         mins = inputDate.getMinutes();

     //Unhide code block div

     const codeWrapper = document.querySelector(".codeWrapper");
     codeWrapper.setAttribute("style", "display: block");

     //Set Recurrence

     setRecur = (selectedRecur) => {
         if (selectedRecur == 'Nightly') {
             return [`&emsp;RecurrenceTypeID,<br>&emsp;RecurEvery<br>`,
                 `&emsp;&emsp;&emsp;1,<br>&emsp;&emsp;&emsp;1`
             ];
         } else if (selectedRecur == 'Once a Month on Selected Date') {
             return [
                 `&emsp;RecurrenceTypeID,<br>
                     &emsp;RecurEvery,<br>
                     &emsp;RecurOfEvery<br>`,
                 `&emsp;&emsp;&emsp;4,<br>
                     &emsp;&emsp;&emsp;${day},<br>
                     &emsp;&emsp;&emsp;1`
             ];
         } else if (selectedRecur == 'Once a Year on Selected Date') {
             return [
                 `&emsp;RecurrenceTypeID,<br>
                     &emsp;RecurEndTypeID,<br>
                     &emsp;RecurEvery,<br>
                     &emsp;RecurNameID<br>`,
                 `&emsp;&emsp;&emsp;6,<br>
                     &emsp;&emsp;&emsp;0,<br>
                     &emsp;&emsp;&emsp;${day},<br>
                     &emsp;&emsp;&emsp;${month}`
             ];
         }
     }

     //Build out SQL statement

     code.innerHTML =
         `INSERT INTO GLSuite_${inputArray[0].value}_DEV..DataRuleQueue
     <br>&emsp;(
     <br>&emsp;EntityIDRequested,
     <br>&emsp;DateRequested,
     <br>&emsp;DataRuleQueueStatusID,
     <br>&emsp;LocatorEntityID,
     <br>&emsp;LocatorObjectID,
     <br>&emsp;LocatorPK,
     <br>&emsp;ObjectID,
     <br>&emsp;ObjectTypeID,
     <br>&emsp;AssociationTypeID,
     <br>${setRecur(inputArray[8].value)[0]}&emsp;)
     <br>&emsp;&emsp;SELECT
     <br>&emsp;&emsp;&emsp;${inputArray[1].value},
     <br>&emsp;&emsp;&emsp;DATETIMEFROMPARTS(${year},${month},${day},${hour},${mins},00,000),
     <br>&emsp;&emsp;&emsp;2,
     <br>&emsp;&emsp;&emsp;${inputArray[3].value},
     <br>&emsp;&emsp;&emsp;${inputArray[4].value},
     <br>&emsp;&emsp;&emsp;${inputArray[5].value},
     <br>&emsp;&emsp;&emsp;34,
     <br>&emsp;&emsp;&emsp;${inputArray[6].value},
     <br>&emsp;&emsp;&emsp;${inputArray[7].value}
     <br>${setRecur(inputArray[8].value)[1]}
     <br>SELECT 1 as RetVal FOR XML RAW`
 })

 //Copy to clipboard

 copy = () => {
     let range = document.createRange();
     range.selectNode(code);
     window.getSelection().addRange(range);
     document.execCommand('Copy');
     window.getSelection().removeAllRanges();
 }