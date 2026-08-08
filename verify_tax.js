/* ==========================================================================
   SUNNY BALANI & CO. - TAX CALCULATION TESTING ENGINE
   ========================================================================== */

const assert = require('assert');

// Isolated replica of the calculators.js formula for testing
function computeTax(grossSalary, otherIncome, ded80C_val, ded80D_val, dedHRA_val) {
    const totalGross = grossSalary + otherIncome;

    // Deductions caps
    const ded80C = Math.min(ded80C_val, 150000);
    const ded80D = Math.min(ded80D_val, 75000);
    const dedHRA = dedHRA_val;

    // Standard Deductions
    const oldStandardDed = 50000;
    const newStandardDed = 75000;

    // 1. OLD REGIME
    let oldTaxable = totalGross - oldStandardDed - ded80C - ded80D - dedHRA;
    oldTaxable = Math.max(0, oldTaxable);

    let oldTax = 0;
    if (oldTaxable > 1000000) {
        oldTax = 112500 + (oldTaxable - 1000000) * 0.3;
    } else if (oldTaxable > 500000) {
        oldTax = 12500 + (oldTaxable - 500000) * 0.2;
    } else if (oldTaxable > 250000) {
        oldTax = (oldTaxable - 250000) * 0.05;
    }

    if (oldTaxable <= 500000) {
        oldTax = 0; // Rebate Section 87A
    }
    const finalOldTax = oldTax + (oldTax > 0 ? oldTax * 0.04 : 0);

    // 2. NEW REGIME (FY 2026-27)
    let newTaxable = totalGross - newStandardDed;
    newTaxable = Math.max(0, newTaxable);

    let newTax = 0;
    if (newTaxable > 2000000) {
        newTax = 200000 + (newTaxable - 2000000) * 0.3;
    } else if (newTaxable > 1600000) {
        newTax = 120000 + (newTaxable - 1600000) * 0.2;
    } else if (newTaxable > 1200000) {
        newTax = 60000 + (newTaxable - 1200000) * 0.15;
    } else if (newTaxable > 800000) {
        newTax = 20000 + (newTaxable - 800000) * 0.1;
    } else if (newTaxable > 400000) {
        newTax = (newTaxable - 400000) * 0.05;
    }

    if (newTaxable <= 700000) {
        newTax = 0; // Rebate Section 87A
    }
    const finalNewTax = newTax + (newTax > 0 ? newTax * 0.04 : 0);

    return {
        oldTaxable,
        newTaxable,
        finalOldTax,
        finalNewTax,
        savings: Math.abs(finalOldTax - finalNewTax)
    };
}

// Run Test Cases
try {
    console.log("=== RUNNING TAX ENGINE TEST CASES ===");

    // Test Case 1: Income ₹15,00,000, standard inputs
    const test1 = computeTax(1500000, 0, 150000, 25000, 0);
    console.log("\n[Test Case 1: Salary ₹15L, Deductions ₹1.75L]");
    console.log(`- Old Net Taxable: ₹${test1.oldTaxable}`);
    console.log(`- New Net Taxable: ₹${test1.newTaxable}`);
    console.log(`- Old Regime Tax:  ₹${test1.finalOldTax}`);
    console.log(`- New Regime Tax:  ₹${test1.finalNewTax}`);
    console.log(`- Savings Amount:  ₹${test1.savings}`);
    
    assert.strictEqual(test1.oldTaxable, 1275000);
    assert.strictEqual(test1.newTaxable, 1425000);
    assert.strictEqual(test1.finalOldTax, 202800);
    assert.strictEqual(test1.finalNewTax, 97500);
    assert.strictEqual(test1.savings, 105300);
    console.log("✓ Test Case 1 Passed!");

    // Test Case 2: Low Income (Rebate eligibility)
    const test2 = computeTax(650000, 0, 150000, 25000, 0);
    console.log("\n[Test Case 2: Salary ₹6.5L (Rebate test)]");
    console.log(`- Old Net Taxable: ₹${test2.oldTaxable}`);
    console.log(`- New Net Taxable: ₹${test2.newTaxable}`);
    console.log(`- Old Regime Tax:  ₹${test2.finalOldTax}`);
    console.log(`- New Regime Tax:  ₹${test2.finalNewTax}`);
    
    assert.strictEqual(test2.finalOldTax, 0); // Taxable under 5L (6.5L - 50k - 1.75L = 4.25L) -> Rebate -> ₹0
    assert.strictEqual(test2.finalNewTax, 0); // Taxable under 7L (6.5L - 75k = 5.75L) -> Rebate -> ₹0
    console.log("✓ Test Case 2 Passed!");

    // Test Case 3: High Income
    const test3 = computeTax(2500000, 50000, 150000, 25000, 50000);
    console.log("\n[Test Case 3: High Income Salary ₹25L, Other ₹50k, Deductions ₹2.25L]");
    console.log(`- Old Regime Tax:  ₹${test3.finalOldTax}`);
    console.log(`- New Regime Tax:  ₹${test3.finalNewTax}`);
    console.log(`- Savings Amount:  ₹${test3.savings}`);
    
    // Old taxable: 25.5L - 50k - 1.5L - 25k - 50k = 22.75L. Tax = 112500 + 12.75L * 0.3 = 495000 + 4% cess = 514800.
    assert.strictEqual(test3.finalOldTax, 514800);
    // New taxable: 25.5L - 75k = 24.75L. Tax = 200000 + 4.75L * 0.3 = 342500 + 4% cess = 356200.
    assert.strictEqual(test3.finalNewTax, 356200);
    console.log("✓ Test Case 3 Passed!");

    console.log("\n=====================================");
    console.log("ALL TAX CALCULATOR TESTS PASSED SUCCESSFULLY!");
    console.log("=====================================");

} catch (error) {
    console.error("❌ Test Validation Failed:", error.message);
    process.exit(1);
}
