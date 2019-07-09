import React from "react";
import ReactDOM from "react-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import "./styles.css";

const benefitsMultiplier = 0.15;
const taxesMultiplier = 0.07;
const hoursWorked = 2087;
const days = 5;
const weeks = 52;
const months = 12;
const workWeek = 8;
const weeklyHours = 40;
const monthlyHours = 173.3;
const yearlyHours = 2087;

let results = {
  benefits: 0,
  taxes: 0,
  totalAnnual: 0,
  totalHourly: 0,
  time: {
    socialWeekly: 0,
    socialMonthly: 0,
    socialAnnually: 0,
    personalWeekly: 0,
    personalMonthly: 0,
    personalAnnually: 0,
    otherWeekly: 0,
    otherMonthly: 0,
    otherAnnually: 0
  },
  dailyLoss: 0,
  weeklyLoss: 0,
  monthlyLoss: 0,
  yearlyLoss: 0,
  productiveHoursDaily: 0,
  productiveHoursWeekly: 0,
  productiveHoursMonthly: 0,
  productiveHoursYearly: 0,
  annualDeficientHours: 0,
  lossPerEmployeeDaily: 0,
  lossPerEmployeeWeekly: 0,
  lossPerEmployeeMonthly: 0,
  lossPerEmployeeYearly: 0,
  lossAllEmployeesDaily: 0,
  lossAllEmployeesWeekly: 0,
  lossAllEmployeesMonthly: 0,
  lossAllEmployeesYearly: 0,
  actualHourlyPay: 0,
  percentageProductivityLoss: 0,
  percentageActualProductivity: 0,
  realHourlyCost: 0
};

class Calculator extends React.Component {
  state = {
    submitted: false
  };

  componentDidUpdate() {
    if (this.state.submitted === true) {
      let input = document.getElementById("calculator");

      html2canvas(input).then(canvas => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();

        pdf.addImage(imgData, "PNG", 0, 0);
        pdf.save(`results.pdf`);
      });
    }
  }

  handleInputChange = event => {
    const target = event.target;
    const value = parseFloat(target.value, 10);
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  calculateProductiveHours = (fullHours, wastedHours) => {
    return fullHours - wastedHours;
  };

  calculateActualPay = calculatedTotalAnnualCosts => {
    return calculatedTotalAnnualCosts / yearlyHours;
  };

  calculateTotalLostPay = hoursLost => {
    return hoursLost * results.actualHourlyPay;
  };

  calculateTime = () => {
    if (!this.state) {
      return;
    } else {
      results.time.socialWeekly = (this.state.socialMediaUse * days).toFixed(2);
      results.time.socialMonthly = (
        (this.state.socialMediaUse * weeks) /
        months
      ).toFixed(2);
      results.time.socialAnnually = (
        this.state.socialMediaUse * months
      ).toFixed(2);
      results.time.personalWeekly = (this.state.personalUse * days).toFixed(2);
      results.time.personalMonthly = (
        (this.state.personalUse * weeks) /
        months
      ).toFixed(2);
      results.time.personalAnnually = (this.state.personalUse * months).toFixed(
        2
      );
      results.time.otherWeekly = (this.state.otherUse * days).toFixed(2);
      results.time.otherMonthly = (
        (this.state.otherUse * weeks) /
        months
      ).toFixed(2);
      results.time.otherAnnually = (this.state.otherUse * months).toFixed(2);
    }
  };

  calculateResults = e => {
    e.preventDefault();
    if (!this.state.salary) {
      return;
    } else {
      results.benefits = this.state.salary * benefitsMultiplier;
      results.taxes = this.state.salary * taxesMultiplier;
      results.totalAnnual =
        this.state.salary + results.benefits + results.taxes;
      const hourly = results.totalAnnual / hoursWorked;
      // const totalHourly = Dinero({ amount: hourly }).toFormat('$0,0.00');
      results.totalHourly = hourly;
      this.calculateTime();
      this.calculateLoss(
        this.state.socialMediaUse,
        this.state.personalUse,
        this.state.otherUse
      );
      results.actualHourlyPay = this.calculateActualPay(results.totalAnnual);
      results.productiveHoursDaily = this.calculateProductiveHours(
        workWeek,
        results.dailyLoss
      );
      results.productiveHoursWeekly = this.calculateProductiveHours(
        weeklyHours,
        results.weeklyLoss
      );
      results.productiveHoursMonthly = this.calculateProductiveHours(
        monthlyHours,
        results.monthlyLoss
      );
      results.productiveHoursYearly = this.calculateProductiveHours(
        yearlyHours,
        results.yearlyLoss
      );
      results.annualDeficientHours = this.calculateProductiveHours(
        yearlyHours,
        results.productiveHoursYearly
      );
      results.lossPerEmployeeDaily = this.calculateTotalLostPay(
        results.dailyLoss
      ).toFixed(2);
      results.lossPerEmployeeWeekly = this.calculateTotalLostPay(
        results.weeklyLoss
      ).toFixed(2);
      results.lossPerEmployeeMonthly = this.calculateTotalLostPay(
        results.monthlyLoss
      ).toFixed(2);
      results.lossPerEmployeeYearly = this.calculateTotalLostPay(
        results.yearlyLoss
      ).toFixed(2);
      results.lossAllEmployeesDaily = (
        results.lossPerEmployeeDaily * this.state.employees
      ).toFixed(2);
      results.lossAllEmployeesWeekly = (
        results.lossPerEmployeeWeekly * this.state.employees
      ).toFixed(2);
      results.lossAllEmployeesMonthly = (
        results.lossPerEmployeeMonthly * this.state.employees
      ).toFixed(2);
      results.lossAllEmployeesYearly = (
        results.lossPerEmployeeYearly * this.state.employees
      ).toFixed(2);
      results.percentageProductivityLoss = results.dailyLoss / workWeek;
      results.percentageActualProductivity =
        1 - results.percentageProductivityLoss;
      results.realHourlyCost = (
        results.lossPerEmployeeDaily / results.productiveHoursDaily
      ).toFixed(2);
      let elForm = document.getElementById("calculator__form");
      let elResults = document.getElementById("calculator__results");
      elForm.style = "display: none";
      elResults.style = "display: grid";
      this.setState({
        submitted: true
      });
      console.log(results);
    }
  };

  calculateLoss = (socialMediaUse, personalUse, otherUse) => {
    results.dailyLoss = socialMediaUse + personalUse + otherUse;
    results.weeklyLoss = results.dailyLoss * days;
    results.monthlyLoss = ((results.weeklyLoss * weeks) / months).toFixed(2);
    results.yearlyLoss = results.monthlyLoss * months;
  };

  render() {
    return (
      <div id="calculator">
        <h1 id="title">
          {this.state.submitted
            ? `Your Productivity Results`
            : `Productivity Calculator`}
        </h1>
        <div id="calculator__results">
          <div className="results">
            Total Benefits Paid: ${results.benefits}
          </div>
          <div className="results">Total Taxes Paid: ${results.taxes}</div>
          <div className="results">
            Total Annual Costs: ${results.totalAnnual}
          </div>
          <div className="results">
            Actual Hourly Pay: ${results.totalHourly}
          </div>
          <div className="results">
            Weekly Social Media Hours: {results.time.socialWeekly}
          </div>
          <div className="results">
            Weekly Personal Hours: {results.time.personalWeekly}
          </div>
          <div className="results">
            Weekly Other Wasted Hours: {results.time.otherWeekly}
          </div>
          <div className="results">
            Monthly Social Media Hours: {results.time.socialMonthly}
          </div>
          <div className="results">
            Monthly Personal Hours: {results.time.personalMonthly}
          </div>
          <div className="results">
            Monthly Other Wasted Hours: {results.time.otherMonthly}
          </div>
          <div className="results">
            Annual Social Media Hours: {results.time.socialAnnually}
          </div>
          <div className="results">
            Annual Personal Hours: {results.time.personalAnnually}
          </div>
          <div className="results">
            Annual Other Wasted Hours: {results.time.otherAnnually}
          </div>
          <div className="results">
            Total Hours Lost per Day: {results.dailyLoss}
          </div>
          <div className="results">
            Total Hours Lost per Week: {results.weeklyLoss}
          </div>
          <div className="results">
            Total Hours Lost per Month: {results.monthlyLoss}
          </div>
          <div className="results">
            Total Hours Lost per Year: {results.yearlyLoss}
          </div>
          <div className="results">
            Total Loss per Employee Daily: ${results.lossPerEmployeeDaily}
          </div>
          <div className="results">
            Total Loss per Employee Weekly: ${results.lossPerEmployeeWeekly}
          </div>
          <div className="results">
            Total Loss per Employee Monthly: ${results.lossPerEmployeeMonthly}
          </div>
          <div className="results">
            Total Loss per Employee Yearly: ${results.lossPerEmployeeYearly}
          </div>
          <div className="results">
            Total Loss All Employee Daily: ${results.lossAllEmployeesDaily}
          </div>
          <div className="results">
            Total Loss All Employee Weekly: ${results.lossAllEmployeesWeekly}
          </div>
          <div className="results">
            Total Loss All Employee Monthly: ${results.lossAllEmployeesMonthly}
          </div>
          <div className="results">
            Total Loss All Employee Yearly: ${results.lossAllEmployeesYearly}
          </div>
          <div className="results">
            Percentage Productivity Lost: %{results.percentageProductivityLoss}
          </div>
          <div className="results">
            Actual Productivity: %{results.percentageActualProductivity}
          </div>
          <div className="results">
            Real Hourly Cost: ${results.realHourlyCost}
          </div>
        </div>
        <div id="calculator__form">
          <div>
            <form>
              <div className="input">
                <input
                  type="number"
                  placeholder="Employees"
                  name="employees"
                  id="text"
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="input">
                <input
                  type="number"
                  placeholder="Average Salary"
                  name="salary"
                  id="text"
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="input">
                <input
                  type="number"
                  placeholder="Social Media Use"
                  name="socialMediaUse"
                  id="text"
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="input">
                <input
                  type="number"
                  placeholder="Personal Use"
                  name="personalUse"
                  id="text"
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="input">
                <input
                  type="number"
                  placeholder="Other Use"
                  name="otherUse"
                  id="text"
                  onChange={this.handleInputChange}
                />
              </div>
            </form>
          </div>
          <div id="calculator__confirm">
            <p>
              {this.state.employees
                ? `You have ${this.state.employees} employees.`
                : `How many employees do you have?`}
            </p>
            <p>
              {this.state.salary
                ? `You pay an average salary of $${this.state.salary} per year.`
                : `On average how much do you pay?`}
            </p>
            <p>
              {this.state.socialMediaUse
                ? `Your employees spend ${
                    this.state.socialMediaUse
                  } hours on social media daily.`
                : `How many hours do your employees spend on social media?`}
            </p>
            <p>
              {this.state.personalUse
                ? `Your employees take ${
                    this.state.personalUse
                  } personal hours per day.`
                : `How many personal hours do your employees take per day?`}
            </p>
            <p>
              {this.state.otherUse
                ? `Your employees waste another ${
                    this.state.otherUse
                  } hours per day.`
                : `How many other others per day do your employees waste?`}
            </p>
            <button
              type="submit"
              className="button"
              onClick={this.calculateResults}
            >
              Calculate Productivity
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Calculator />, rootElement);
