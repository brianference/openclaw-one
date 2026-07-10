/** Demo tasks + security checks. */
export const DEMO = {
  "tasks": [
    {
      "id": "t1",
      "title": "Wire gateway URL",
      "col": "todo"
    },
    {
      "id": "t2",
      "title": "Enable biometric unlock",
      "col": "doing"
    },
    {
      "id": "t3",
      "title": "Ship TestFlight build",
      "col": "done"
    }
  ],
  "checks": [
    {
      "id": "c1",
      "label": "App transport security patterns documented",
      "ok": true
    },
    {
      "id": "c2",
      "label": "Secrets stay in Secure Store (not AsyncStorage)",
      "ok": true
    },
    {
      "id": "c3",
      "label": "Gateway TLS required in production",
      "ok": true
    },
    {
      "id": "c4",
      "label": "Biometric gate optional but recommended",
      "ok": true
    }
  ]
} as const
