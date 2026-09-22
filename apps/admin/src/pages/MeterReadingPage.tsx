import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Form,
  InputNumber,
  Select,
  Space,
  Tag,
  Typography,
  Upload,
} from "antd";
import {
  CameraOutlined,
  CheckOutlined,
  LogoutOutlined,
  ReloadOutlined,
  StopOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { getGlobalContext } from "../lib/context";
import { ExpenseLocationDataType } from "../lib/interface";

interface OperatorLocation {
  locationCode: string;
  locationName: string;
  locationAddress: string;
  expenses?: ExpenseLocationDataType[];
}

interface LocationResponse {
  data: OperatorLocation[];
}

interface LocationDetailResponse extends OperatorLocation {
  expenses: ExpenseLocationDataType[];
}

interface MeterOcrResponse {
  electricMeterReading?: string | number;
}

const MeterReadingPage = () => {
  const { serviceClient, setAuthUser, useToast } = getGlobalContext();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [locations, setLocations] = useState<OperatorLocation[]>([]);
  const [locationCode, setLocationCode] = useState<string>();
  const [expenseCode, setExpenseCode] = useState<string>();
  const [reading, setReading] = useState<number>();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const selectedLocation = locations.find(
    (location) => String(location.locationCode) === locationCode,
  );
  const expenses = selectedLocation?.expenses || [];
  const selectedExpense = expenses.find(
    (expense) => String(expense.expenseCode) === expenseCode,
  );
  const readingDelta =
    selectedExpense && reading !== undefined
      ? reading - Number(selectedExpense.currentUnit || 0)
      : undefined;

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraOpen(false);
  };

  const signOut = () => {
    stopCamera();
    setAuthUser(undefined);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    serviceClient
      .get<LocationResponse>("/location?page=1&size=20")
      .then((response) => setLocations(response.data.data))
      .catch(() => setError("Unable to load locations."));

    return stopCamera;
  }, [serviceClient]);

  const loadLocationExpenses = async (nextLocationCode: string) => {
    setIsLoadingExpenses(true);
    setError(undefined);

    try {
      const response = await serviceClient.get<LocationDetailResponse>(
        `/location/${nextLocationCode}`,
      );
      setLocations((current) =>
        current.map((location) =>
          String(location.locationCode) === nextLocationCode
            ? { ...location, expenses: response.data.expenses }
            : location,
        ),
      );
    } catch {
      setError("Unable to load expenses for this location.");
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      void videoRef.current.play();
    }
  }, [isCameraOpen]);

  const startCamera = async () => {
    setError(undefined);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch {
      setError("Camera access was unavailable. Use the upload option instead.");
    }
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setError(undefined);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await serviceClient.post<MeterOcrResponse>(
        "/openai/process-meter-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      const value = Number(response.data.electricMeterReading);
      if (!Number.isFinite(value)) throw new Error("Invalid OCR result");
      setReading(value);
      useToast("success", "Meter reading detected. Please confirm it.");
    } catch {
      setError("The meter image could not be processed. Try another image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob)
        void processImage(
          new File([blob], "meter.jpg", { type: "image/jpeg" }),
        );
    }, "image/jpeg");
    stopCamera();
  };

  const uploadProps: UploadProps = {
    accept: "image/jpeg,image/png",
    showUploadList: false,
    beforeUpload: (file) => {
      void processImage(file);
      return false;
    },
  };

  const submitReading = async () => {
    if (!selectedLocation || !selectedExpense || reading === undefined) return;
    if (reading < Number(selectedExpense.currentUnit || 0)) {
      setError("The new reading cannot be lower than the previous reading.");
      return;
    }

    setIsSubmitting(true);
    setError(undefined);
    try {
      await serviceClient.patch(
        `/location/${selectedLocation.locationCode}/expenses/${selectedExpense.expenseCode}/meter`,
        { currentUnit: reading },
      );
      setLocations((current) =>
        current.map((location) =>
          location.locationCode === selectedLocation.locationCode
            ? {
                ...location,
                expenses: location.expenses?.map((expense) =>
                  expense.expenseCode === selectedExpense.expenseCode
                    ? { ...expense, currentUnit: reading }
                    : expense,
                ),
              }
            : location,
        ),
      );
      setReading(undefined);
      useToast("success", "Meter reading updated successfully.");
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to update the meter reading.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="meter-page">
      <header className="meter-page-header">
        <div>
          <Typography.Text className="meter-eyebrow">
            FIELD UPDATE
          </Typography.Text>
          <Typography.Title level={2}>Meter reading</Typography.Title>
          <Typography.Paragraph>
            Capture a meter image, confirm the reading, and update the selected
            location.
          </Typography.Paragraph>
        </div>
        <div className="meter-status-chip">
          <span className="meter-status-dot" />
          Ready to capture
        </div>
        <Button
          className="meter-signout-button"
          icon={<LogoutOutlined />}
          onClick={signOut}
        >
          Sign out
        </Button>
      </header>

      {error && <Alert type="error" showIcon message={error} />}

      <Card className="meter-selection-card" bordered={false}>
        <div className="meter-section-heading">
          <div className="meter-step">01</div>
          <div>
            <Typography.Title level={4}>Choose what to update</Typography.Title>
            <Typography.Text type="secondary">
              Select a location and one expense before opening the camera.
            </Typography.Text>
          </div>
        </div>
        <Form layout="vertical">
          <div className="meter-selection-grid">
            <Form.Item label="Location" required>
              <Select
                value={locationCode}
                placeholder="Choose a location"
                style={{ width: "100%" }}
                onChange={(value) => {
                  setLocationCode(value);
                  setExpenseCode(undefined);
                  setReading(undefined);
                  void loadLocationExpenses(value);
                }}
                options={locations.map((location) => ({
                  value: String(location.locationCode),
                  label: `${location.locationName} - ${location.locationAddress}`,
                }))}
              />
            </Form.Item>
            <Form.Item label="Expense" required>
              <Select
                value={expenseCode}
                disabled={!locationCode || isLoadingExpenses}
                loading={isLoadingExpenses}
                placeholder={
                  isLoadingExpenses
                    ? "Loading assigned expenses..."
                    : "Choose an expense"
                }
                style={{ width: "100%" }}
                onChange={(value) => {
                  setExpenseCode(value);
                  setReading(undefined);
                }}
                options={expenses.map((expense) => ({
                  value: String(expense.expenseCode),
                  label: `${expense.expenseName} (${expense.unitName})`,
                }))}
              />
            </Form.Item>
          </div>
          {selectedExpense && (
            <div className="meter-previous-reading">
              <div>
                <Typography.Text type="secondary">
                  Previous reading
                </Typography.Text>
                <Typography.Title level={3}>
                  {selectedExpense.currentUnit ?? 0}
                  <Typography.Text type="secondary">
                    {" "}
                    {selectedExpense.unitName || "units"}
                  </Typography.Text>
                </Typography.Title>
              </div>
              <Tag color="green">Baseline</Tag>
            </div>
          )}
        </Form>
      </Card>

      <div className="meter-workflow-grid">
        <Card className="meter-capture-card" bordered={false}>
          <div className="meter-card-heading">
            <div className="meter-step">02</div>
            <div>
              <Typography.Title level={4}>Capture meter image</Typography.Title>
              <Typography.Text type="secondary">
                Use the rear camera or upload a clear image.
              </Typography.Text>
            </div>
          </div>
          {isCameraOpen && (
            <div className="meter-camera-frame">
              <video ref={videoRef} autoPlay muted playsInline />
              <div className="meter-camera-guide" />
              <Typography.Text>
                Align the meter inside the frame
              </Typography.Text>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
          {!isCameraOpen && !isProcessing && (
            <div className="meter-empty-capture">
              <CameraOutlined />
              <Typography.Text>Choose a capture method</Typography.Text>
            </div>
          )}
          <Space wrap className="meter-action-row">
            {!isCameraOpen ? (
              <Button
                icon={<CameraOutlined />}
                onClick={startCamera}
                disabled={!selectedExpense}
              >
                Open camera
              </Button>
            ) : (
              <>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={captureImage}
                >
                  Capture and read
                </Button>
                <Button icon={<StopOutlined />} onClick={stopCamera}>
                  Stop
                </Button>
              </>
            )}
            <Upload
              {...uploadProps}
              disabled={!selectedExpense || isProcessing}
            >
              <Button
                icon={<UploadOutlined />}
                disabled={!selectedExpense || isProcessing}
              >
                Upload image
              </Button>
            </Upload>
            {isProcessing && (
              <Typography.Text type="secondary">
                Reading image...
              </Typography.Text>
            )}
          </Space>
        </Card>

        <Card className="meter-confirm-card" bordered={false}>
          <div className="meter-card-heading">
            <div className="meter-step">03</div>
            <div>
              <Typography.Title level={4}>Confirm reading</Typography.Title>
              <Typography.Text type="secondary">
                Check the detected value before saving.
              </Typography.Text>
            </div>
          </div>
          <Space direction="vertical" className="meter-confirm-content">
            <InputNumber
              min={selectedExpense?.currentUnit || 0}
              precision={0}
              step={1}
              value={reading}
              onChange={(value) =>
                setReading(value === null ? undefined : value)
              }
              placeholder="Enter or correct the reading"
              className="meter-reading-input"
            />
            {reading !== undefined &&
              readingDelta !== undefined &&
              readingDelta >= 0 && (
                <Typography.Text className="meter-change-note">
                  +{readingDelta} {selectedExpense?.unitName || "units"} since
                  last reading
                </Typography.Text>
              )}
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              loading={isSubmitting}
              disabled={!selectedExpense || reading === undefined}
              onClick={submitReading}
            >
              Update reading
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default MeterReadingPage;
