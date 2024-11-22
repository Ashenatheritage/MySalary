
document.addEventListener("DOMContentLoaded", () => {
  const workdaysTable = document.querySelector("#workdays tbody");
  const calculateBtn = document.getElementById("calculate");
  const downloadBtn = document.getElementById("download-slip");
  const monthInput = document.getElementById("month");
  
  let salaryData = [];

  function generateTable(startDay, endDay) {
    workdaysTable.innerHTML = "";
    for (let i = startDay; i <= endDay; i++) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${i}</td>
        <td>
          <input type="time" class="day-in"> - 
          <input type="time" class="day-out">
        </td>
        <td>
          <input type="time" class="night-in"> - 
          <input type="time" class="night-out">
        </td>
        <td>
          <input type="checkbox" class="special-day">
        </td>`;
      workdaysTable.appendChild(row);
    }
  }

  function calculateSalary() {
    const rows = workdaysTable.querySelectorAll("tr");
    let basicSalary = 0, otSalary = 0, bonus = 0;

    rows.forEach((row, index) => {
      const dayIn = row.querySelector(".day-in").value;
      const dayOut = row.querySelector(".day-out").value;
      const nightIn = row.querySelector(".night-in").value;
      const nightOut = row.querySelector(".night-out").value;
      const isSpecial = row.querySelector(".special-day").checked;

      // Convert times to hours
      const calculateHours = (start, end) => {
        if (start && end) {
          const [sh, sm] = start.split(":").map(Number);
          const [eh, em] = end.split(":").map(Number);
          return (eh + em / 60) - (sh + sm / 60);
        }
        return 0;
      };

      const dayHours = calculateHours(dayIn, dayOut);
      const nightHours = calculateHours(nightIn, nightOut);

      if (isSpecial) {
        otSalary += (dayHours + nightHours) * 262;
      } else {
        const isWeekday = index % 7 !== 6; // Assuming rows align with weekdays
        const overtimeHours = (dayHours > 8 ? dayHours - 8 : 0) + 
                              (nightHours > 8 ? nightHours - 8 : 0);

        basicSalary += isWeekday ? 1400 : 0;
        otSalary += overtimeHours * 262;
        if (dayHours > 0 && isWeekday) bonus += 450;
      }
    });

    const totalSalary = basicSalary + otSalary + bonus;

    document.getElementById("basic-salary").textContent = `Rs. ${basicSalary}`;
    document.getElementById("ot-salary").textContent = `Rs. ${otSalary}`;
    document.getElementById("bonus").textContent = `Rs. ${bonus}`;
    document.getElementById("total-salary").textContent = `Rs. ${totalSalary}`;
  }

  function generatePDF() {
    const pdf = new jsPDF();
    pdf.text("Salary Slip", 10, 10);
    pdf.save("SalarySlip.pdf");
  }

  monthInput.addEventListener("change", () => {
    const [year, month] = monthInput.value.split("-");
    const daysInMonth = new Date(year, month, 0).getDate();
    generateTable(1, daysInMonth);
  });

  calculateBtn.addEventListener("click", calculateSalary);
  downloadBtn.addEventListener("click", generatePDF);
});
