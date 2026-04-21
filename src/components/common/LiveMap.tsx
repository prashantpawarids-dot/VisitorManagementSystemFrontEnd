import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  visitors: any[];
}

export function LiveMap({ visitors }: Props) {
  return (
    <MapContainer
      center={[visitors[0].location.latitude, visitors[0].location.longitude]}
      zoom={17}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {visitors.map((v: any) => (
        <Marker key={v.id} position={[v.location.latitude, v.location.longitude]}>
          <Popup>
            <div style={{ fontSize: "13px" }}>
              <p style={{ fontWeight: 600, margin: 0 }}>{v.visitorName}</p>
              <p style={{ margin: "2px 0" }}>{v.hostName} · {v.flatNumber}</p>
              <p style={{ margin: 0, color: "#888" }}>
                Updated:{" "}
                {new Date(v.location.updatedAt + "Z").toLocaleTimeString("en-IN", {
                  hour: "2-digit", minute: "2-digit", hour12: true,
                })}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}