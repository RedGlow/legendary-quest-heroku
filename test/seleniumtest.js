var assert = require('assert'),
    test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver')
    ;

test.describe('Google search', function () {
    test.it('Should work', function () {
        this.timeout(5000);
        var driver = new webdriver.Builder().
            withCapabilities(webdriver.Capabilities.chrome()).
            build();

        driver.get('http://www.google.com');
        driver.findElement(webdriver.By.name('q')).sendKeys('simple programmer');
        driver.findElement(webdriver.By.name('q')).sendKeys(webdriver.Key.ESCAPE);
        driver.findElement(webdriver.By.name('btnK')).click();
        driver.quit();
    });
});