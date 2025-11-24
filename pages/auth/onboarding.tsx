"use client"

import { useState } from "react"
import { AddIcon, ArrowLeftIcon } from "@/components/icons"
import { Button, Typography, Input } from "@/components/ui"

const emptyFarm = () => ({
  type: "",
  size: "",
  state: "",
  lga: "",
  address: "",
})

const Onboarding = () => {
  const [step, setStep] = useState<1 | 2>(1)
  const [farms, setFarms] = useState([emptyFarm()])
  const [nin, setNin] = useState("")

  const updateFarm = (index: number, field: string, value: string) => {
    setFarms(prev => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const addFarm = () => setFarms(prev => [...prev, emptyFarm()])
  const removeFarm = (index: number) =>
    setFarms(prev => prev.filter((_, i) => i !== index))

  const isStep1Valid = () => {
    // require at least one farm with all fields filled
    return farms.some(f =>
      f.type.trim() && f.size.trim() && f.state.trim() && f.lga.trim() && f.address.trim()
    )
  }

  const handleContinue = () => {
    if (step === 1 && isStep1Valid()) setStep(2)
    // submit logic for step2 would go here
  }

  const handleBack = () => {
    if (step === 2) setStep(1)
    // otherwise navigate back in app if needed
  }

  return (
    <>
      <div className="w-full mb-7">
        <div onClick={handleBack} className="w-fit cursor-pointer">
          <ArrowLeftIcon size={20} />
        </div>
      </div>

      <Typography variant="intro" className="w-full mb-4">Sign up as a farmer</Typography>

      <div className="w-full mb-4">
        <div className="h-1 bg-primary/30 rounded-full overflow-hidden">
          <div
            className={`h-full bg-primary rounded-full transition-all`}
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>
      </div>

      {step === 1 ? (
        <>
          {farms.map((farm, idx) => (
            <div key={idx} className="w-full mb-4">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="normal" className="font-bold">Farm {idx + 1}</Typography>
                {farms.length > 1 && (
                  <button
                    onClick={() => removeFarm(idx)}
                    className="text-sm text-red-500 cursor-pointer"
                    aria-label={`Remove farm ${idx + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>

              <Input
                label="What type of farm do you run?"
                id={`farm-type-${idx}`}
                type="text"
                value={farm.type}
                onChange={e => updateFarm(idx, "type", e.target.value)}
                className="mb-4"
              />

              <Input
                label="Farm Size (Sqm)"
                id={`farm-size-${idx}`}
                type="text"
                value={farm.size}
                onChange={e => updateFarm(idx, "size", e.target.value)}
                className="mb-4"
              />

              <Input
                label="Select state that the farm is located?"
                id={`farm-state-${idx}`}
                type="text"
                value={farm.state}
                onChange={e => updateFarm(idx, "state", e.target.value)}
                className="mb-4"
              />

              <Input
                label="Enter Local Government Area of farm"
                id={`farm-lga-${idx}`}
                type="text"
                value={farm.lga}
                onChange={e => updateFarm(idx, "lga", e.target.value)}
                className="mb-4"
              />

              <Input
                label="Enter farm address"
                id={`farm-address-${idx}`}
                type="text"
                value={farm.address}
                onChange={e => updateFarm(idx, "address", e.target.value)}
              />
            </div>
          ))}

          <div className="w-full">
            <button
              onClick={addFarm}
              className="flex items-center gap-1 cursor-pointer mb-4"
              type="button"
            >
              <AddIcon color="var(--primary)" size={20} />
              <Typography variant="normal" className="text-primary font-medium">Add another farm</Typography>
            </button>
          </div>

          <Button
            variant="primary"
            className="w-full uppercase mt-2"
            size="large"
            type="button"
            onClick={handleContinue}
            disabled={!isStep1Valid()}
          >
            Continue
          </Button>

          <Typography className="uppercase text-foreground200 font-medium mt-3 p-4 cursor-pointer" onClick={() => {/* skip action */}}>
            Skip for later
          </Typography>
        </>
      ) : (
        <>
          <Input
            label="Enter your National Identification Number (NIN)"
            id="nin"
            type="text"
            value={nin}
            onChange={e => setNin(e.target.value)}
            bottomText="Your NIN is needed to verify your identity"
          />

          <div className="w-full mt-4">
            <Button
              variant="primary"
              className="w-full uppercase"
              size="large"
              type="submit"
              disabled={!nin}
              onClick={() => {
                // submit farms + nin
              }}
            >
              Complete signup
            </Button>
          </div>

          <Typography className="uppercase text-foreground200 font-medium mt-3 p-4 cursor-pointer">
            Skip for later
          </Typography>
        </>
      )}
    </>
  )
}

export default Onboarding