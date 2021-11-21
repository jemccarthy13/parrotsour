import PSCookies from "./pscookies"

describe("PSCookies", () => {
  it("has_default_cookies", () => {
    expect(PSCookies.getHardMode()).toEqual(false)
    expect(PSCookies.getBraaFirst()).toEqual(false)
    expect(PSCookies.getDataStyleIsRadar()).toEqual(false)
    expect(PSCookies.getOrientNS()).toEqual(false)
    expect(PSCookies.getSliderValue()).toEqual(50)
    expect(PSCookies.getWantMeasure()).toEqual(false)
  })

  it("sets_cookies", () => {
    PSCookies.setHardMode(true)
    PSCookies.setBraaFirst(true)
    PSCookies.setDataStyleIsRadar(true)
    PSCookies.setOrientNS(true)
    PSCookies.setSliderValue(25)
    PSCookies.setWantMeasure(true)

    const newCooks = new PSCookies()
    expect(newCooks).toEqual(new PSCookies())

    expect(PSCookies.getHardMode()).toEqual(true)
    expect(PSCookies.getBraaFirst()).toEqual(true)
    expect(PSCookies.getDataStyleIsRadar()).toEqual(true)
    expect(PSCookies.getOrientNS()).toEqual(true)
    expect(PSCookies.getSliderValue()).toEqual(25)
    expect(PSCookies.getWantMeasure()).toEqual(true)

    PSCookies.setDefault()
  })
})
