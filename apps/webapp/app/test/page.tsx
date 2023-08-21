// "use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionHeading,
  AccordionTrigger,
} from "ui-library";
export default async function Page() {
  // const data = await getData();

  return (
    <div>
      <h2>Testing components</h2>
      <Accordion type="multiple" orientation="horizontal">
        <AccordionItem value="item-1">
          <AccordionHeading asChild>
            <h4>
              <AccordionTrigger>
                <span>hei Is it accessible?</span>
              </AccordionTrigger>
            </h4>
          </AccordionHeading>
          <AccordionContent asChild>
            <p>Yes. It adheres to the WAI-ARIA design pattern.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionHeading asChild>
            <h4>
              <AccordionTrigger>
                <span>hei Is it accessible?</span>
              </AccordionTrigger>
            </h4>
          </AccordionHeading>
          <AccordionContent asChild>
            <p>Yes. It adheres to the WAI-ARIA design pattern.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
