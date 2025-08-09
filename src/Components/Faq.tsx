import { ReactNode } from "react";

const Faq = () => {
  return (
    <div className="mb-8 max-w-200 max-h-[80vh] overflow-auto border-b-2 border-black ">
      <Question>Is this site legal to use for challenge bombs?</Question>
      <Answer>
        <span>
          This site was specifically made with{" "}
          <a
            href="https://bombs.samfun.dev/rules"
            target="blank"
            className="underline"
          >
            challenge bomb rules
          </a>{" "}
          in mind.
        </span>
        <p>
          It has also been checked by repo maintainers and confirmed to be
          legal.
        </p>
      </Answer>
      <Question>
        Why the name K<span className="underline">Ty</span>NE?
      </Question>
      <Answer>
        It's a mix of the acronym KTaNE (Keep Talking and Nobody Explodes) and
        my name ("Ty").
      </Answer>
      <Question>I don't see a new mod in the mod list?</Question>
      <Answer>
        The modlist on KTyNE is currently updated manually. If a new mod was
        published to the repo after the latest KTyNE mod sync, it will not be on
        the KTyNE list. However, if there are no search results for a manual,
        you can select "New Repo Tab" to open a blank repo tab and navigate to
        it from there.
      </Answer>
      <Question>Why is the manual for X not updated?</Question>
      <Answer>See Previous Question.</Answer>
      <Question>How do I use alternate manuals?</Question>
      <Answer>
        When searching for a new manual to open click the arrow icon next to the
        mod name.
      </Answer>
      <Question>How do I change the default manual?</Question>
      <Answer>
        When opening an alternate manual (See previous question), if you click
        an manual that isn't your default it will prompt you if you want to
        change your default.
      </Answer>
      <Question>
        Something isn't working correctly! How can I let you know it needs
        fixed?
      </Question>
      <Answer>You can send me an email: typiesco@gmail.com</Answer>
    </div>
  );
};

const Question = ({ children }: { children: ReactNode }) => {
  return (
    <p>
      <b>Question:</b> {children}
    </p>
  );
};

const Answer = ({ children }: { children: ReactNode }) => {
  return (
    <p className="mb-4">
      <b>Answer:</b> {children}
    </p>
  );
};

export default Faq;
