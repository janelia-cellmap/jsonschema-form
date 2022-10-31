import { useState, Suspense } from "react";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import Grid from "@mui/material/Grid";
import { useLoaderData } from "@remix-run/react";

function BrowserOnly({
  children,
  fallback,
}: {
  children?: () => JSX.Element;
  fallback?: JSX.Element;
}): JSX.Element | null {
  if (typeof document === "undefined" || children == null) {
    return fallback || null;
  }
  return <>{children()}</>;
}

export const loader = async () => {
  const formSchema = await fetch(
    "https://fct5d83geg.execute-api.us-east-1.amazonaws.com/openapi.json"
  ).then((res) => res.json());
  return formSchema.components.schemas.Sample;
};

export default function Index() {
  const [formOutput, setFormOutput] = useState({});
  const formSchema = useLoaderData();
  return (
    <main>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <h1>Input</h1>
          <Form
            schema={formSchema}
            validator={validator}
            onSubmit={({ formData }, e) =>  {e.preventDefault(); setFormOutput(formData)}}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <h1>Output</h1>
          <Suspense fallback="">
            <BrowserOnly>
              {() => {
                const ReactJson = require("react-json-view").default;
                return <ReactJson src={formOutput} />;
              }}
            </BrowserOnly>
          </Suspense>
        </Grid>
      </Grid>
    </main>
  );
}
