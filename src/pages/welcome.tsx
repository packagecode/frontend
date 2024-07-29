import { showToast } from "@/contexts/Toast.tsx";
import useGlobalServices from "@/hooks/useGlobalServices";
import {
  FC,
  Fragment,
  MutableRefObject,
  useEffect,
  useRef,
  useState
} from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface WelcomeProps {}

const Welcome: FC<WelcomeProps> = () => {
  const domainRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const [hostname, setHostname] = useState<string>("");
  const [validated, setValidated] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const navigate = useNavigate();
  const { validateClient, rootDomainCheck, getCsrfCookie } =
    useGlobalServices();

  const handleNext = async (event: any) => {
    event.preventDefault();
    const domain = domainRef.current?.value;
    if (!domain) {
      setFeedbackMessage("The domain field is required");
      setValidated(true);
      return;
    }
    setFeedbackMessage("");
    setValidated(false);
    getCsrfCookie(true);
    console.log(domain);

    validateClient(domain)
      .then(() => {
        setValidated(true);
        window.location.href =
          window.location.origin.replace("app", domain) + "/login";
      })
      .catch(error => {
        if (error.response.status === 404) {
          showToast("error", `The domain ${domain} dose not exists`);
          setFeedbackMessage(`The domain ${domain} dose not exists`);
        }
      });
  };

  useEffect(() => {
    const checkRootDomain = async () => {
      const isRoot = await rootDomainCheck();
      if (!isRoot) {
        navigate("/login", { replace: true });
      }
    };
    checkRootDomain();

    const hostname = window.location.hostname.split(".").slice(-2).join(".");
    setHostname(hostname);
  }, []);

  return (
    <Fragment>
      <Container fluid className="overflow-hidden">
        <Row className="align-items-center" style={{ height: "100vh" }}>
          <Col xl={12}>
            <div className="about-container mb-4">
              <div className="row pb-5 px-3 about-motto">
                <Col xxl={5} xl={8} lg={10} md={10} sm={12}>
                  <div className="text-justify">
                    <div className="text-dark fs-26 fw-semibold mb-4">
                      <span className="about-heading">
                        Welcome to Sokrio DMS
                      </span>
                    </div>
                    <p className="fs-14 mb-4 text-muted">
                      Empowering Your Workforce
                    </p>
                    <p className="fs-14 mb-4 text-muted">
                      Sokrio DMS is the best distribution management system in
                      Bangladesh, helping businesses automate their sales,
                      inventory, and order management processes.
                    </p>
                  </div>
                  <Form noValidate validated={validated} onSubmit={handleNext}>
                    <Form.Group>
                      <Form.Label
                        htmlFor="domain"
                        className="form-label text-default d-block"
                      >
                        Domain
                      </Form.Label>
                      <InputGroup hasValidation>
                        <Form.Control
                          ref={domainRef}
                          type="text"
                          name="domain"
                          placeholder="fmcg"
                          aria-describedby="domainPrepend"
                          id="domain"
                          isInvalid={!!feedbackMessage}
                          required
                        />
                        <InputGroup.Text id="domainPrepend">
                          .{hostname}
                        </InputGroup.Text>
                        <Form.Control.Feedback type="invalid">
                          {feedbackMessage}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                    <Col xl={12} className="d-grid mt-2">
                      <Button
                        variant="primary"
                        className="btn"
                        type="submit"
                        onClick={handleNext}
                      >
                        Next
                      </Button>
                    </Col>
                  </Form>
                </Col>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};
export default Welcome;
