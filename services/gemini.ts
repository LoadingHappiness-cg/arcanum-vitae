
export async function getMirrorReflection(userInput: string) {
  try {
    const response = await fetch('/api/mirror', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: userInput }),
    });
    const data = await response.json();
    return data.text || "Silence is the only mirror left.";
  } catch (error) {
    console.error("Mirror failed to reflect:", error);
    return "The glass is broken. Return to the source.";
  }
}

export async function curateSubmission(userInput: string) {
  try {
    const response = await fetch('/api/curate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: userInput }),
    });
    const data = await response.json();
    return data.text || "The archive remains closed.";
  } catch (error) {
    console.error("Curation failed:", error);
    return "Chaos in the archive. Try again.";
  }
}

export async function generateBandPortrait(memberDescription: string) {
  try {
    const response = await fetch('/api/portrait', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: memberDescription }),
    });
    if (!response.ok) throw new Error("Backend failed");
    const data = await response.json();
    return data.url || null;
  } catch (error) {
    console.error("Portrait generation failed:", error);
    return null;
  }
}
